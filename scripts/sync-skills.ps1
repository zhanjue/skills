param(
    [string]$Category = "",
    [string]$Only = "",
    [switch]$List
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$ConfigPath = Join-Path $Root "skills.json"

if (-not (Test-Path $ConfigPath)) {
    Write-Error "找不到配置文件: $ConfigPath"
    exit 1
}

$Config = Get-Content -Raw -Encoding UTF8 $ConfigPath | ConvertFrom-Json
$Categories = if ($Category) { $Config.categories | Where-Object { $_.id -eq $Category } } else { $Config.categories }

if (-not $Categories) {
    Write-Error "未找到分类: $Category"
    exit 1
}

foreach ($cat in $Categories) {
    $catDir = Join-Path $Root $cat.id
    $items = if ($Only) { $cat.items | Where-Object { $_.name -eq $Only } } else { $cat.items }
    if (-not $items) { continue }

    Write-Host "`n=== $($cat.name) ($($cat.id)/) ===" -ForegroundColor Cyan
    foreach ($item in $items) {
        if ($item.type -eq "local") {
            Write-Host "  [本地自研] $($item.name) -> $($item.url)" -ForegroundColor Magenta
            continue
        }
        if ($item.type -ne "github" -or -not $item.repo) {
            Write-Host "  [链接] $($item.name) -> $($item.url)" -ForegroundColor DarkGray
            continue
        }

        $targetDir = Join-Path $catDir $item.name
        $exists = Test-Path (Join-Path $targetDir ".git")

        if ($List) {
            $status = if ($exists) { "已拉取" } else { "未拉取" }
            Write-Host "  [$status] $($item.name) ($($item.repo))"
            continue
        }

        New-Item -ItemType Directory -Force -Path $catDir | Out-Null
        if ($exists) {
            Write-Host "-> 更新 $($item.name) ($($item.repo))..." -ForegroundColor Green
            git -C $targetDir pull --ff-only
        } else {
            Write-Host "-> 浅克隆 $($item.name) ($($item.repo))..." -ForegroundColor Yellow
            git clone --depth 1 "https://github.com/$($item.repo).git" $targetDir
        }
    }
}
