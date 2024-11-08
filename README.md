"# op1-client" 


Tarvitaan: 
- vite projekti 
- lipun tarkastus id mukaan -> get
- merkkaa lippu käytetyksi -> put

## Visionäärien ticket-luokka

> ### _Ticket_
> _Ticket_
>_Ticket-taulu sisältää lipun tiedot._
> Kenttä | Tyyppi | Kuvaus
> ------ | ------ | ------
> ticketId | int PK | Lipun id
> hashcode | varchar | Lipun koodi
> price |	int | Lipun hinta
> ticketUsedDate | timestamp | Lipun käyttö pvm
> ticketTypeId | int FK | Tapahtuma, viittaus TicketType-tauluun



