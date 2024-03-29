/* tslint:disable */
/* eslint-disable */
/**
 * OpenStax Kinetic API
 * The Kinetic API for OpenStax.  Requests to this API should include `application/json` in the `Accept` header.  The desired API version is specified in the request URL, e.g. `[domain]/api/v1/researcher/studies`. While the API does support a default version, that version will change over time and therefore should not be used in production code! 
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface BaseResearcher
 */
export interface BaseResearcher {
    /**
     * The researcher's first name.
     * @type {string}
     * @memberof BaseResearcher
     */
    firstName?: string;
    /**
     * The researcher's last name.
     * @type {string}
     * @memberof BaseResearcher
     */
    lastName?: string;
    /**
     * The researcher's institution.
     * @type {string}
     * @memberof BaseResearcher
     */
    institution?: string;
    /**
     * The researcher's bio.
     * @type {string}
     * @memberof BaseResearcher
     */
    bio?: string;
    /**
     * The researcher's lab page.
     * @type {string}
     * @memberof BaseResearcher
     */
    labPage?: string;
    /**
     * The researcher's interest (1).
     * @type {string}
     * @memberof BaseResearcher
     */
    researchInterest1?: string;
    /**
     * The researcher's interest (2).
     * @type {string}
     * @memberof BaseResearcher
     */
    researchInterest2?: string;
    /**
     * The researcher's interest (3).
     * @type {string}
     * @memberof BaseResearcher
     */
    researchInterest3?: string;
    /**
     * Researchers role
     * @type {string}
     * @memberof BaseResearcher
     */
    role?: BaseResearcherRoleEnum;
}


/**
 * @export
 */
export const BaseResearcherRoleEnum = {
    Member: 'member',
    Pi: 'pi',
    Lead: 'lead'
} as const;
export type BaseResearcherRoleEnum = typeof BaseResearcherRoleEnum[keyof typeof BaseResearcherRoleEnum];


/**
 * Check if a given object implements the BaseResearcher interface.
 */
export function instanceOfBaseResearcher(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function BaseResearcherFromJSON(json: any): BaseResearcher {
    return BaseResearcherFromJSONTyped(json, false);
}

export function BaseResearcherFromJSONTyped(json: any, ignoreDiscriminator: boolean): BaseResearcher {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'firstName': !exists(json, 'first_name') ? undefined : json['first_name'],
        'lastName': !exists(json, 'last_name') ? undefined : json['last_name'],
        'institution': !exists(json, 'institution') ? undefined : json['institution'],
        'bio': !exists(json, 'bio') ? undefined : json['bio'],
        'labPage': !exists(json, 'lab_page') ? undefined : json['lab_page'],
        'researchInterest1': !exists(json, 'research_interest1') ? undefined : json['research_interest1'],
        'researchInterest2': !exists(json, 'research_interest2') ? undefined : json['research_interest2'],
        'researchInterest3': !exists(json, 'research_interest3') ? undefined : json['research_interest3'],
        'role': !exists(json, 'role') ? undefined : json['role'],
    };
}

export function BaseResearcherToJSON(value?: BaseResearcher | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'first_name': value.firstName,
        'last_name': value.lastName,
        'institution': value.institution,
        'bio': value.bio,
        'lab_page': value.labPage,
        'research_interest1': value.researchInterest1,
        'research_interest2': value.researchInterest2,
        'research_interest3': value.researchInterest3,
        'role': value.role,
    };
}

