import { app, HttpFunctionOptions, HttpRequest, HttpResponse, HttpResponseInit, InvocationContext } from "@azure/functions";
import { escapeRegExp } from "../utils";


const q = `Alias: $vrdr-filing-format-cs = http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-filing-format-cs
Alias: $vrdr-replace-status-cs = http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-replace-status-cs
Alias: $loinc = http://loinc.org
Alias: $sct = http://snomed.info/sct
Alias: $vrdr-document-section-cs = http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-document-section-cs
Alias: $administrative-gender = http://hl7.org/fhir/administrative-gender
Alias: $v2-0203 = http://terminology.hl7.org/CodeSystem/v2-0203
Alias: $v2-0136 = http://terminology.hl7.org/CodeSystem/v2-0136
Alias: $vrdr-bypass-edit-flag-cs = http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-bypass-edit-flag-cs
Alias: $v3-MaritalStatus = http://terminology.hl7.org/CodeSystem/v3-MaritalStatus
Alias: $v2-0131 = http://terminology.hl7.org/CodeSystem/v2-0131
Alias: $v3-RoleCode = http://terminology.hl7.org/CodeSystem/v3-RoleCode
Alias: $v3-NullFlavor = http://terminology.hl7.org/CodeSystem/v3-NullFlavor
Alias: $vrdr-location-type-cs = http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-location-type-cs
Alias: $location-physical-type = http://terminology.hl7.org/CodeSystem/location-physical-type
Alias: $vrdr-organization-type-cs = http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-organization-type-cs
Alias: $observation-category = http://terminology.hl7.org/CodeSystem/observation-category
Alias: $v2-0360 = http://terminology.hl7.org/CodeSystem/v2-0360
Alias: $vrdr-observations-cs = http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-observations-cs
Alias: $vrdr-component-cs = http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-component-cs
Alias: $data-absent-reason = http://terminology.hl7.org/CodeSystem/data-absent-reason

Instance: 8b3b53dd-22f1-4f42-874b-50a2dee5a02d
InstanceOf: Bundle
Usage: #example
* meta.profile = "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-certificate-document"
* identifier.extension[0].url = "http://hl7.org/fhir/us/vrdr/StructureDefinition/AuxiliaryStateIdentifier1"
* identifier.extension[=].valueString = "000007324929"
* identifier.extension[+].url = "http://hl7.org/fhir/us/vrdr/StructureDefinition/CertificateNumber"
* identifier.extension[=].valueString = "000133"
* identifier.system = "http://nchs.cdc.gov/vrdr_id"
* identifier.value = "2023OR000133"
* type = #document
* timestamp = "2023-11-27T13:21:41.871848-05:00"
* entry[=].resource = 366c8b97-76eb-45b0-8ed8-091d243adc9b

Instance: ce56bbd2-b0fb-4a87-a506-c369d79c0549
InstanceOf: Composition
Usage: #inline
* meta.profile = "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-certificate"
* extension[0].url = "http://hl7.org/fhir/us/vrdr/StructureDefinition/FilingFormat"
* extension[0].url = "http://hl7.org/fhir/us/vrdr/StructureDefinition/FilingFormat"
* extension[=].valueCodeableConcept = $vrdr-filing-format-cs#electronic "Electronic"
* extension[+].url = "http://hl7.org/fhir/us/vrdr/StructureDefinition/ReplaceStatus"
* extension[=].valueCodeableConcept = $vrdr-replace-status-cs#original "original record"
* status = #final`

export const PROFILES = {
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-activity-at-time-of-death": "ActivityAtTimeOfDeath",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-automated-underlying-cause-of-death": "AutomatedUnderlyingCauseOfDeath",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-autopsy-performed-indicator": "AutopsyPerformedIndicator",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-birth-record-identifier": "BirthRecordIdentifier",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-cause-of-death-coded-bundle": "CauseOfDeathCodedContentBundle",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-cause-of-death-part1": "CauseOfDeathPart1",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-cause-of-death-part2": "CauseOfDeathPart2",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-certifier": "Certifier",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-coded-race-and-ethnicity": "CodedRaceAndEthnicity",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-coding-status-values": "CodingStatusValues",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-certificate": "DeathCertificate",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-certificate-document": "DeathCertificateDocument",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-certification": "DeathCertification",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-date": "DeathDate",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-location": "DeathLocation",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent": "Decedent",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-age": "DecedentAge",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-disposition-method": "DecedentDispositionMethod",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-education-level": "DecedentEducationLevel",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-father": "DecedentFather",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-military-service": "DecedentMilitaryService",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-mother": "DecedentMother",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-pregnancy": "DecedentPregnancyStatus",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-spouse": "DecedentSpouse",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-usual-work": "DecedentUsualWork",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-demographic-coded-bundle": "DemographicCodedContentBundle",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-disposition-location": "DispositionLocation",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-entity-axis-cause-of-death": "EntityAxisCauseOfDeath",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-examiner-contacted": "ExaminerContacted",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-funeral-home": "FuneralHome",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-injury-incident": "InjuryIncident",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-injury-location": "InjuryLocation",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-input-race-and-ethnicity": "InputRaceAndEthnicity",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-manner-of-death": "MannerOfDeath",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-manual-underlying-cause-of-death": "ManualUnderlyingCauseOfDeath",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-mortician": "Mortician",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-place-of-injury": "PlaceOfInjury",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-record-axis-cause-of-death": "RecordAxisCauseOfDeath",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-surgery-date": "SurgeryDate",
    "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-tobacco-use-contributed-to-death": "TobaccoUseContributedToDeath"
}

export const convertInstanceOfToProfileName = (text: string): string => {
    for (const [key, value] of Object.entries(PROFILES)) {
        const s = String.raw`InstanceOf: \w+\n(Usage: .*\n(\* meta\..*\n)*?\* meta\.profile = "${escapeRegExp(key)}")`
        const regex = new RegExp(s, 'gm');
        text = text.replace(regex, `InstanceOf: ${value}\n$1`);
    }

    return text;
}

const Handler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log(`Http function processed request for url "${request.url}"`);

    const body = await request.json();
    body['fsh'] = convertInstanceOfToProfileName(body['fsh']);

    const response: HttpResponseInit = {
        status: 200,
        jsonBody: body
    };

    return response;
}

app.http('ConvertInstanceOf', <HttpFunctionOptions>{
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: Handler
});
