const { Onfido, Region, OnfidoApiError } = require("@onfido/api");
const { countryISOs } = require("~utilities/countries");
require('dotenv').config();


class OnfidoProvider {

    constructor() {

        const onfido = new Onfido({
            apiToken: process.env.ONFIDO_SANDBOX_API_KEY,
            // Supports Region.EU, Region.US and Region.CA
            region: Region.EU
        });

        this.onfido = onfido;

        this.DocumentTypes = {
            ID_CARD: "national_identity_card",
            DRIVING_LICENCE: "driving_licence",
            PASSPORT: "passport",
            VOTER_ID: "voter_id",
            WORK_PERMIT: "work_permit"
        };

        this.IDTypes = {
            SSN: "ssn",
            SOCIAL_INSURANCE: "social_insurance",
            TAX_ID: "tax_id",
            IDENTITY_CARD: "identity_card",
            DRIVING_LICENCE: "driving_licence",
            SHARE_CODE: "share_code",
            VOTER_ID: "voter_id",
            PASSPORT: "passport"

        };
    }


    setApplicant(applicantId) {
        this.applicantId = applicantId;
    }



    async createNewApplicant(applicantData) {
        try {
            const applicant = await this.onfido.applicant.create({
                firstName: applicantData.first_name,
                lastName: applicantData.last_name,
                email: applicantData.email,
                dob: applicantData.dob,
                id_numbers: [
                    {
                        type: this.IDTypes[applicantData.id_type.toUpperCase()],
                        value: applicantData.id_number
                    }
                ],
                location: {
                    countryOfResidence: this.countryToISO(applicantData.country)
                }
            });
            return applicant;
        } catch (error) {
            if (error instanceof OnfidoApiError) {
                // An error response was received from the Onfido API, extra info is available.
                console.log(error.message);
            } else {
                // No response was received for some reason e.g. a network error.
                console.log(error.message);
            }
        }

    }

    async uploadDocument() {
        const document = new Onfido.Document();
    }


    /* --------------------------- UTITLITY FUNCTIONS --------------------------- */

    countryToISO(country) {
        var countryISO = Object.values(countryISOs).filter((cnt) => cnt == country);
        if (countryISO.length > 0) {
            var countryIndex = Object.values(countryISOs).indexOf(countryISO[0]);
        }
        return Object.keys(countryISOs)[countryIndex];
    }
}

const OnfidoInstance = new OnfidoProvider();
module.exports = OnfidoInstance;

