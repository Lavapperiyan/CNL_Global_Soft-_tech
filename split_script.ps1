$ErrorActionPreference = "Stop"

# Use explicit paths and consistent encoding
$desktopPath = "C:\Users\Lavapperiyan\Desktop\web"
$indexPath = Join-Path $desktopPath "index.html"
$aboutPath = Join-Path $desktopPath "about.html"
$servicesPath = Join-Path $desktopPath "services.html"
$contactPath = Join-Path $desktopPath "contact.html"

# Read raw content
$html = Get-Content -Path $indexPath -Raw -Encoding UTF8

# Update Navigation Links
$html = $html -replace 'href="#home"', 'href="index.html"'
$html = $html -replace 'href="#about"', 'href="about.html"'
$html = $html -replace 'href="#services"', 'href="services.html"'
$html = $html -replace 'href="#contact"', 'href="contact.html"'

# Find block boundaries
$heroStart = $html.IndexOf('<!-- Hero Section -->')
$aboutStart = $html.IndexOf('<!-- About Section -->')
$servicesStart = $html.IndexOf('<!-- Services Section -->')
$contactStart = $html.IndexOf('<!-- Contact Section -->')
$footerStart = $html.IndexOf('<!-- Footer -->')

if ($heroStart -eq -1) { throw "Could not find Hero Section" }

# Extract blocks
$navBlock = $html.Substring(0, $heroStart)
$heroBlock = $html.Substring($heroStart, $aboutStart - $heroStart)
$aboutBlock = $html.Substring($aboutStart, $servicesStart - $aboutStart)
$servicesBlock = $html.Substring($servicesStart, $contactStart - $servicesStart)
$contactBlock = $html.Substring($contactStart, $footerStart - $contactStart)
$footerBlock = $html.Substring($footerStart)

# Add margin for pages without hero header so navbar doesn't cover content
$spacer = "<div style=`"height: 100px;`"></div>`r`n"

# Rewrite index.html (Home page -> Hero + About Summary + Footer)
# We will keep Hero and a summary of About? Let's just keep Hero and maybe simple Services preview.
# Actually, let's keep Hero and Footer for index
$indexOutput = $navBlock + $heroBlock + $footerBlock
Set-Content -Path $indexPath -Value $indexOutput -Encoding UTF8

# about.html
$aboutOutput = $navBlock + $spacer + $aboutBlock + $footerBlock
Set-Content -Path $aboutPath -Value $aboutOutput -Encoding UTF8

# services.html
$servicesOutput = $navBlock + $spacer + $servicesBlock + $footerBlock
Set-Content -Path $servicesPath -Value $servicesOutput -Encoding UTF8

# contact.html
$contactOutput = $navBlock + $spacer + $contactBlock + $footerBlock
Set-Content -Path $contactPath -Value $contactOutput -Encoding UTF8

Write-Host "Success"
