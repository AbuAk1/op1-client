*** Settings ***
Documentation           Test to check RF environment w/ SeleniumLibrary & ChromeDriver.
Library         SeleniumLibrary   15.0   5.0

Test Setup      Open Sovellus
Test Teardown   Close Browser

*** Variables ***
${BASE_URL}      http://localhost:5173/
${BROWSER}      Chrome





*** Test Cases ***
Kirjautuminen
    [Documentation]    Testaa, että kirjautuminen onnistuu
    Open Sovellus
    Kirjautuminen userina
    Close Browser

Tapahtumat listattuna
    [Documentation]    Testaa, että pääsee tapahtumalistaukseen
    Open Sovellus
    Kirjautuminen userina
    Tapahtumien listaus
    Close Browser

Lipuntarkastus
    [Documentation]    Testaa, että lipun tarkastus onnistuu
    Open Sovellus
    Kirjautuminen userina
    Lipuntarkastaminen
    Lippu käytetyksi
    Close Browser

Virheellinen lippu
    [Documentation]    Testaa, että virheellinen lippu antaa ilmoituksen
    Open Sovellus
    Kirjautuminen userina
    Väärä lippu
    Close Browser

*** Keywords ***
Open Sovellus
    Open Browser    ${BASE_URL}    ${BROWSER}

Kirjautuminen userina
    [Documentation]     Kirjautuu sovellukseen käyttäjänä user-käyttäjänä
    Input Text    xpath=//input[@type='text']    matti321
    Input Text    xpath=//input[@type='password']    salasana
    Click Button  xpath=//button[@type='submit']
    Alert Should Be Present       action=ACCEPT

Tapahtumien listaus
    [Documentation]     Hakee sovelluksesta tapahtumalistan
    Element Should Contain    xpath=//h3[text()='Home']    Home
    Wait Until Element Is Visible   xpath=//div[text()='Siirry Myyntiin']
    Element Should Be Visible    xpath=//div[text()='Siirry Myyntiin']
    Click Element        xpath=//button[.//div[text()='Siirry Myyntiin']]
    Wait Until Element Is Visible   xpath=//button[text()='Hae tapahtumat']
    Wait Until Page Contains Element    xpath=//div

Lipuntarkastaminen
    [Documentation]     Tarkistaa lipun
    Element Should Contain    xpath=//h3[text()='Home']    Home
    Wait Until Element Is Visible   xpath=//div[text()='Siirry Tarkistukseen']
    Element Should Be Visible    xpath=//div[text()='Siirry Tarkistukseen']
    Click Element        xpath=//button[.//div[text()='Siirry Tarkistukseen']]
    Input Text    xpath=//input[@type='text']    0ff0352f-95b9-4b1d-8fc1-8251a39ed4ba
    Click Element   xpath=//button[text()='Etsi']
    Wait Until Page Contains Element    xpath=//div
   

Väärä lippu
    [Documentation]     Tarkistaa lipun
    Element Should Contain    xpath=//h3[text()='Home']    Home
    Wait Until Element Is Visible   xpath=//div[text()='Siirry Tarkistukseen']
    Click Element        xpath=//button[.//div[text()='Siirry Tarkistukseen']]
    Input Text    xpath=//input[@type='text']    0ff0352f-95b9-4b1d-251a39ed4ba
    Click Element   xpath=//button[text()='Etsi']
    Wait Until Page Contains Element    xpath=//p
    Page Should Contain    Ei saatavilla tietoja maksua varten.

Lippu käytetyksi
    Click Button  xpath=//button[text()='Merkitse käytetyksi']
    Page Should Contain    Käytetty: true
    
Lippu ei-käytetyksi
    Click Button  xpath=//button[text()='peruuta']
    Page Should Contain    Käytetty: false
