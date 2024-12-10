*** Settings ***
Documentation           Test to check RF environment w/ SeleniumLibrary & ChromeDriver.
Library         SeleniumLibrary   15.0   5.0

*** Variables ***
${BASE_URL}      https://op1-client-front-ohjelmistoprojekti.2.rahtiapp.fi/
${BROWSER}      Chrome


*** Test Cases ***
Kirjautuminen väärillä tunnuksilla
    [Documentation]     Kirjautuu sovellukseen väärillä tunnuksilla
    Open Sovellus
    Input Text    xpath=//input[@type='text']    matti
    Input Text    xpath=//input[@type='password']    salasana
    Click Button  xpath=//button[@type='submit']
    Element Should Be Visible     xpath=/html/body/div/div/div[2]/div/div/div[2]
    Close Browser

Tapahtuman lisääminen
    [Documentation]    Testaa, että tapahtumia pystyy lisäämään
    Open Sovellus
    Kirjautuminen adminina
    Siirry hallintaan
    Lisää uusi tapahtuma 
    Close Browser

Lippumäärän lisäys myyntitapahtumaan
    [Documentation]    Testaa, että myyntitapahtumalle voidaan lisätä useampi lippu
    Open Sovellus
    Kirjautuminen userina
    Siirry myyntiin
    Lisää liput maksutapahtumalle
    Lasketaan lippurivit
    Close Browser

Maksutapahtuman summa
    [Documentation]    Testaa, lippuja myytäessä näkyy myynnin summa
    Open Sovellus
    Kirjautuminen userina
    Siirry myyntiin
    Lisää liput maksutapahtumalle
    Tarkista summa
    Close Browser


*** Keywords ***
Open Sovellus
    Open Browser    ${BASE_URL}    ${BROWSER}

Kirjautuminen userina
    [Documentation]     Kirjautuu sovellukseen käyttäjänä user-käyttäjänä
    Input Text    xpath=//input[@type='text']    myyja
    Input Text    xpath=//input[@type='password']    myyja
    Click Button  xpath=//button[@type='submit']
    Alert Should Be Present       action=ACCEPT

Kirjautuminen adminina
    [Documentation]     Kirjautuu sovellukseen käyttäjänä admin-käyttäjänä
    Input Text    xpath=//input[@type='text']    admin
    Input Text    xpath=//input[@type='password']    admin
    Click Button  xpath=//button[@type='submit']
    Alert Should Be Present       action=ACCEPT

Siirry hallintaan
    Element Should Contain    xpath=//h3[text()='VALIKKO']    VALIKKO
    Wait Until Element Is Visible   xpath=//div[text()='Siirry Hallintaan']
    Click Element        xpath=//button[.//div[text()='Siirry Hallintaan']]
    Wait Until Element Is Visible  xpath=//button[@type='button' and text()='Lisää Tapahtuma +']

Lisää uusi tapahtuma
    Click Element  xpath=//button[@type='button' and text()='Lisää Tapahtuma +']
    Element Should Contain    xpath=//h6[text()='Uusi tapahtuma']    Uusi tapahtuma
    Input Text                xpath=/html/body/div[2]/div[3]/div/div[1]/div/input             Testitapahtuma
    Input Text                xpath=/html/body/div[2]/div[3]/div/div[2]/div/input             24-12-2024
    Input Text                xpath=/html/body/div[2]/div[3]/div/div[3]/div/input             Helsinki
    Input Text                xpath=/html/body/div[2]/div[3]/div/div[4]/div/textarea[1]       Testaustapahtuma
    Input Text                xpath=/html/body/div[2]/div[3]/div/div[5]/div/input             2
    Input Text                xpath=/html/body/div[2]/div[3]/div/div[6]/div/input             23-12-2024
    Click Element             xpath=/html/body/div[2]/div[3]/div/button
    Alert Should Be Present             action=ACCEPT
    Wait Until Element Is Visible       xpath=/html/body/div/div/div[2]/div[2]/div/table/tbody
    Element Should Contain              xpath=/html/body/div/div/div[2]/div[2]/div/table/tbody      Testitapahtuma    

Siirry myyntiin
    Element Should Contain    xpath=//h3[text()='VALIKKO']    VALIKKO
    Wait Until Element Is Visible   xpath=//div[text()='Siirry Myyntiin']
    Click Element        xpath=//button[.//div[text()='Siirry Myyntiin']]
    Wait Until Element Is Visible   xpath=//button[text()='Hae tapahtumat']

Lisää liput maksutapahtumalle
    [Documentation]     Hae tapahtumat - Myy lippuja - Valitse hintaluokka - Lisää lippu
    Click Element        xpath=//button[text()='Hae tapahtumat']
    Wait Until Page Contains Element     xpath=//*[@id="root"]/div/div
    Click Element       xpath=//*[@id="root"]/div/div/div[1]/div[2]/button
    Click Element       xpath=/html/body/div[2]/div[3]/div/div/div
    Click Element       xpath=/html/body/div[3]/div[3]/ul/li[2]
    Click Element       xpath=/html/body/div[2]/div[3]/button
    Click Element       xpath=//*[@id="root"]/div/div/div[1]/div[2]/button
    Click Element       xpath=/html/body/div[2]/div[3]/div/div/div
    Click Element       xpath=/html/body/div[3]/div[3]/ul/li[3]
    Click Element       xpath=/html/body/div[2]/div[3]/button
    Wait Until Element Is Visible    xpath=/html/body/div/div/div[2]/table/tbody/tr[2]
    
Lasketaan lippurivit
    ${rows}=    Get Element Count    xpath=/html/body/div/div/div[2]/table/tbody/tr
    Should Be Equal As Numbers    ${rows}       2

Tarkista summa
    Click Element       xpath=//*[@id="root"]/div/div[2]/button
    Element Should Contain          xpath=//*[@id="root"]/div/div[2]/p      Hinta yhteensä: 23€
