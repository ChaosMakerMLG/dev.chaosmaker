<!DOCTYPE html>
<html lang="pl-PL">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'>
    <link href="style/global_dark.css" rel="stylesheet">
    <link href="style/footer.css" rel="stylesheet">
    <link href="style/maintenance/master.css" rel="stylesheet">
    <link href="style/loader.css" rel="stylesheet">
    <title>Maintenance</title>
</head>
<div id="loader-master" class="visible">
    <div id="loader">
        <div id="bar-wrapper">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
        </div>
    </div>
</div>
<body id="maintenance">
    <div id="wrapper">
        <h1 class="fade" id="header">Strona w konserwacji</h1>
        <p class="fade" id="notice">Strona jest obecnie w konserwacji. Przepraszam za niedogodność, wkrótce będzie dostępna</p>
        <p class="fade" id="error">Jeżeli uważasz że jest to błąd, proszę skontaktuj się ze mną <a href="mailto:biznes.olszewski@gmail.com?subject=Website/Portfolio under maintenance">tutaj</a></p>
    </div>
    <div id="footer">
        <div class="footer-child" id="footer-lang-child">
            <div id="lang-switch" onclick="NextLang(true);">
                <i class='bx bx-translate'></i>
            </div>
            <div id="lang-wrapper" class="">
                <div id="pl" class="lang visible"><img class="flags" src="/images/flag-for-flag-poland-svgrepo-com.svg" alt="PL" height="30" width="30"/></div>
                <div id="en" class="lang"><img class="flags" src="/images/flag-for-flag-united-kingdom-svgrepo-com.svg" alt="EN" height="30" width="30"/></div>
                <?php
                if($langs) {
                    echo '<div id="ja" class="lang"><img class="flags" src="/images/japan-svgrepo-com.svg" alt="JA" height="30" width="30"/></div>
                            <div id="de" class="lang"><img class="flags" src="/images/germany-svgrepo-com.svg" alt="DE" height="30" width="30"/></div>
                                <div id="fr" class="lang"><img class="flags" src="/images/france-svgrepo-com.svg" alt="FR" height="30" width="30"/></div>';
                }
                ?>
            </div>
        </div>
        <div class="footer-child" id="footer-up-child">

        </div>
        <div class="footer-child" id="footer-theme-child">
            <div id="theme-switch" onclick="SwitchTheme()">
                <i id="icon" class="bx bxs-sun-dim"></i>
            </div>
        </div>
    </div>
</body>
<script src="script/global.js"></script>
</html>