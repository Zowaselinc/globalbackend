const { Onfido, Region, OnfidoApiError } = require("@onfido/api");
const { countryISOs } = require("~utilities/countries");
require('dotenv').config();
const fs = require('fs');


class OnfidoProvider {

    constructor() {

        const onfido = new Onfido({
            apiToken: process.env.ONFIDO_SANDBOX_API_KEY,
            // Supports Region.EU, Region.US and Region.CA
            region: Region.EU
        });

        this.onfido = onfido;

        this.DocumentTypes = {
            IDENTITY_CARD: "national_identity_card",
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

    setDocumentType(documentType) {
        this.documentType = documentType;
    }

    setCountry(country) {
        this.country = country;
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
            if (applicant.id) {
                this.setApplicant(applicant.id);
                this.setCountry(this.countryToISO(applicantData.country));
                this.setDocumentType(this.DocumentTypes[applicantData.id_type.toUpperCase()]);
            }
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

    async uploadDocument(file, side) {
        let doc = await this.onfido.document.upload({
            applicantId: this.applicantId,
            file: {
                contents: file.data,
                filepath: file.name,
                contentType: file.mimetype
            },
            type: this.documentType,
            side: side,
            issuingCountry: this.country
        });
        return doc;
    }

    async retrieveApplicant(id) {
        const applicant = await this.onfido.applicant.find(id);
        return applicant;

    }

    async checkDocument() {
        const newCheck = await this.onfido.check.create({
            applicantId: this.applicantId,
            reportNames: ["document"]
        });
        return newCheck;
    }

    async retriveDocument(id) {
        const check = await this.onfido.check.find(id);
        return check

    }

    async listCheck(applicantid) {
        const listchecks = await this.onfido.check.list(applicantid);
        return listchecks;
    }

    async listDocument(applicantid) {
        const listchecks = await this.onfido.document.list(applicantid);
        return listchecks;
    }


    async resumeCheck(id) {
        const checks = await this.onfido.check.resume(id);
        return checks;
    }

    async downloadCheck(id) {
        const checkDownload = await this.onfido.check.download(id);
        return checkDownload;
    }

    async downloadDocument(id) {
        const checkDownload = await this.onfido.document.download(id);
        return checkDownload;
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

