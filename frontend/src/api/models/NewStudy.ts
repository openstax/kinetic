/* tslint:disable */
/* eslint-disable */
/**
 * OpenStax Labs API
 * The labs API for OpenStax.  Requests to this API should include `application/json` in the `Accept` header.  The desired API version is specified in the request URL, e.g. `[domain]/api/v0/researcher/studies`. While the API does support a default version, that version will change over time and therefore should not be used in production code! 
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
 * @interface NewStudy
 */
export interface NewStudy {
    /**
     * The study name that participants see.
     * @type {string}
     * @memberof NewStudy
     */
    titleForParticipants: string;
    /**
     * An study name that only researchers see.
     * @type {string}
     * @memberof NewStudy
     */
    titleForResearchers?: string;
    /**
     * A short study description.
     * @type {string}
     * @memberof NewStudy
     */
    shortDescription: string;
    /**
     * A long study description.
     * @type {string}
     * @memberof NewStudy
     */
    longDescription?: string;
    /**
     * The category of the study object, used for grouping.
     * @type {string}
     * @memberof NewStudy
     */
    category: NewStudyCategoryEnum;
    /**
     * The expected study duration in minutes.
     * @type {number}
     * @memberof NewStudy
     */
    durationMinutes?: number;
    /**
     * When the study opens for participation; null means not open.
     * @type {Date}
     * @memberof NewStudy
     */
    opensAt?: Date;
    /**
     * When the study closes for participation; null means does not close.
     * @type {Date}
     * @memberof NewStudy
     */
    closesAt?: Date;
}

/**
* @export
* @enum {string}
*/
export enum NewStudyCategoryEnum {
    ResearchStudy = 'research_study',
    CognitiveTask = 'cognitive_task',
    Survey = 'survey'
}

export function NewStudyFromJSON(json: any): NewStudy {
    return NewStudyFromJSONTyped(json, false);
}

export function NewStudyFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewStudy {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'titleForParticipants': json['title_for_participants'],
        'titleForResearchers': !exists(json, 'title_for_researchers') ? undefined : json['title_for_researchers'],
        'shortDescription': json['short_description'],
        'longDescription': !exists(json, 'long_description') ? undefined : json['long_description'],
        'category': json['category'],
        'durationMinutes': !exists(json, 'duration_minutes') ? undefined : json['duration_minutes'],
        'opensAt': !exists(json, 'opens_at') ? undefined : (new Date(json['opens_at'])),
        'closesAt': !exists(json, 'closes_at') ? undefined : (new Date(json['closes_at'])),
    };
}

export function NewStudyToJSON(value?: NewStudy | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title_for_participants': value.titleForParticipants,
        'title_for_researchers': value.titleForResearchers,
        'short_description': value.shortDescription,
        'long_description': value.longDescription,
        'category': value.category,
        'duration_minutes': value.durationMinutes,
        'opens_at': value.opensAt === undefined ? undefined : (value.opensAt.toISOString()),
        'closes_at': value.closesAt === undefined ? undefined : (value.closesAt.toISOString()),
    };
}


