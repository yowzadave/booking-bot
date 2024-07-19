# Booking Bot

A simple bot for booking a tennis court; Useful when you can't be at your computer at the moment the courts will be made available for booking.

- Might break if the website is updated!
- Has hardcoded strings for the booking site and court IDs!
- Will need to be adapted slightly for a different tenant of the court booking software provider.

To run:
```
node index.js --hour=15 --court=2
```

Requires `SKEDDA_EMAIL` and `SKEDDA_PASSWORD` environment variables to be present. A `.env` file can be used to supply these.
