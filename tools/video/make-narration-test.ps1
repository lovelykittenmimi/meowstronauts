param([int]$Rate = 3)

Add-Type -AssemblyName System.Speech

$out = Join-Path $PSScriptRoot '..\..\output\test-narration.wav'
$out = [System.IO.Path]::GetFullPath($out)
New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null

$text = Get-Content (Join-Path $PSScriptRoot 'narration.txt') -Raw

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Zira Desktop')
$synth.Rate = $Rate
$synth.Volume = 100
$synth.SetOutputToWaveFile($out)
$synth.Speak($text)
$synth.Dispose()

Write-Output $out
