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
    Lippu ei-käytetyksi
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
    Element Should Contain    xpath=//div[text()='Home']    Home
    Click Button  xpath=//button[text()='Siiry Myyntiin']
    Click Button  xpath=//button[text()='Hae tapahtumat']
    Wait Until Element Is Visible    xpath=//div[@class='event-list']    timeout=20s
    Element Should Be Visible    xpath=//div[@class='event-list']

Lipuntarkastaminen
    [Documentation]     Tarkistaa lipun
    Element Should Contain    xpath=//div[text()='Home']    Home
    Click Button  xpath=//button[text()='Siiry Tarkistukseen']
    Input Text    xpath=//input[@type='text']    c8f35b60-679d-4c5d-b367-2ebc8b422e3a
    Click Element    xpath=//input[@type='button' and @value='Etsi']
    Wait Until Page Contains Element    xpath=//div
    Page Should Contain    LippuId:
    Page Should Contain    Tapahtuman nimi:
    Page Should Contain    Hintaluokka:
    Page Should Contain    Lippumäärä:
    Page Should Contain    Käytetty:

Väärä lippu
    [Documentation]     Tarkistaa lipun
    Element Should Contain    xpath=//div[text()='Home']    Home
    Click Button  xpath=//button[text()='Siiry Tarkistukseen']
    Input Text    xpath=//input[@type='text']    c8f35b60-679d-4c5d--2ebc8b422e3a
    Click Element    xpath=//input[@type='button' and @value='Etsi']
    Wait Until Page Contains Element    xpath=//p
    Page Should Contain    Ei saatavilla tietoja maksua varten.

Lippu käytetyksi
    Click Button  xpath=//button[text()='Merkitse käytetyksi']
    Page Should Contain    Käytetty: true
    
Lippu ei-käytetyksi
    Click Button  xpath=//button[text()='ei käytä']
    Page Should Contain    Käytetty: false
