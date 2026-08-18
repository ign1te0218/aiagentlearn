$ErrorActionPreference = 'Stop'

$bundledNode = 'C:\Users\DELL\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$node = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($node) { $node.Source } else { $null }

if ($nodePath) {
    $version = & $nodePath --version
    $major = [int](($version -replace '^v', '').Split('.')[0])
    if ($major -lt 20) {
        $nodePath = $null
    }
}

if (-not $nodePath -and (Test-Path -LiteralPath $bundledNode)) {
    $nodePath = $bundledNode
}

if (-not $nodePath) {
    throw '未找到 Node.js 20+。请安装 Node.js 24 LTS 后重新运行。'
}

& $nodePath (Join-Path $PSScriptRoot 'server.js')
