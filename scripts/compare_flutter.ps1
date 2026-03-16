$ErrorActionPreference = "Stop"

function Get-RelHash($root) {
  $rootPath = (Resolve-Path $root).Path
  Get-ChildItem -LiteralPath $rootPath -Recurse -File -Force |
    Where-Object { $_.FullName -notmatch "\\build\\|\\\.dart_tool\\|\\android\\\.gradle\\" } |
    ForEach-Object {
      $rel = $_.FullName.Substring($rootPath.Length).TrimStart("\")
      $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash
      [pscustomobject]@{
        RelPath       = $rel
        Hash          = $hash
        FullName      = $_.FullName
        LastWriteTime = $_.LastWriteTimeUtc
      }
    }
}

$mobile = Get-RelHash "mobile-app" | Sort-Object RelPath
$legal  = Get-RelHash "legal_doc_app" | Sort-Object RelPath

$mobileMap = @{}
foreach ($x in $mobile) { $mobileMap[$x.RelPath] = $x }

$legalMap = @{}
foreach ($x in $legal) { $legalMap[$x.RelPath] = $x }

$allPaths = @($mobile.RelPath + $legal.RelPath | Sort-Object -Unique)

$onlyInMobile = @()
$onlyInLegal = @()
$diff = @()

foreach ($p in $allPaths) {
  $m = $mobileMap[$p]
  $l = $legalMap[$p]
  if ($null -eq $m) { $onlyInLegal += $p; continue }
  if ($null -eq $l) { $onlyInMobile += $p; continue }
  if ($m.Hash -ne $l.Hash) {
    $diff += [pscustomobject]@{
      RelPath    = $p
      MobileTime = $m.LastWriteTime
      LegalTime  = $l.LastWriteTime
    }
  }
}

"ONLY_IN_MOBILE=$($onlyInMobile.Count)"
"ONLY_IN_LEGAL=$($onlyInLegal.Count)"
"DIFF=$($diff.Count)"

if ($onlyInMobile.Count -gt 0) {
  ""
  "Paths only in mobile-app:"
  $onlyInMobile | Sort-Object | Select-Object -First 50 | ForEach-Object { "  - $_" }
}

if ($onlyInLegal.Count -gt 0) {
  ""
  "Paths only in legal_doc_app:"
  $onlyInLegal | Sort-Object | Select-Object -First 50 | ForEach-Object { "  - $_" }
}

if ($diff.Count -gt 0) {
  $diff | Sort-Object RelPath | Select-Object -First 50 | Format-Table -AutoSize
}

