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
import type { LearningPath } from './LearningPath';
import {
    LearningPathFromJSON,
    LearningPathFromJSONTyped,
    LearningPathToJSON,
} from './LearningPath';
import type { Researcher } from './Researcher';
import {
    ResearcherFromJSON,
    ResearcherFromJSONTyped,
    ResearcherToJSON,
} from './Researcher';
import type { Stage } from './Stage';
import {
    StageFromJSON,
    StageFromJSONTyped,
    StageToJSON,
} from './Stage';

/**
 * 
 * @export
 * @interface ParticipantStudy
 */
export interface ParticipantStudy {
    /**
     * The study ID.
     * @type {number}
     * @memberof ParticipantStudy
     */
    id: number;
    /**
     * How popular the study is on a fractional scale of 0.0 to 1.0
     * @type {number}
     * @memberof ParticipantStudy
     */
    popularityRating?: number;
    /**
     * Is this study the demographic survey?
     * @type {boolean}
     * @memberof ParticipantStudy
     */
    readonly isDemographicSurvey?: boolean;
    /**
     * Should this study be featured more prominently?
     * @type {boolean}
     * @memberof ParticipantStudy
     */
    readonly isFeatured?: boolean;
    /**
     * Is this study a part of the syllabus contest?
     * @type {boolean}
     * @memberof ParticipantStudy
     */
    readonly isSyllabusContestStudy?: boolean;
    /**
     * When the study was aborted; null indicates stage was marked complete
     * @type {Date}
     * @memberof ParticipantStudy
     */
    abortedAt?: Date;
    /**
     * When the study was completed; null means not completed.
     * @type {Date}
     * @memberof ParticipantStudy
     */
    completedAt?: Date;
    /**
     * When the study was opted-out of; null means not opted out.
     * @type {Date}
     * @memberof ParticipantStudy
     */
    optedOutAt?: Date;
    /**
     * The study's total point value.
     * @type {number}
     * @memberof ParticipantStudy
     */
    totalPoints: number;
    /**
     * The study's total duration in minutes.
     * @type {number}
     * @memberof ParticipantStudy
     */
    totalDuration: number;
    /**
     * The study name that participants see.
     * @type {string}
     * @memberof ParticipantStudy
     */
    titleForParticipants?: string;
    /**
     * The study name that only researchers see.
     * @type {string}
     * @memberof ParticipantStudy
     */
    titleForResearchers?: string;
    /**
     * A short study description.
     * @type {string}
     * @memberof ParticipantStudy
     */
    shortDescription: string;
    /**
     * A long study description.
     * @type {string}
     * @memberof ParticipantStudy
     */
    longDescription?: string;
    /**
     * An internal study description for researchers.
     * @type {string}
     * @memberof ParticipantStudy
     */
    internalDescription?: string;
    /**
     * Freeform id of image that should be displayed on study card
     * @type {string}
     * @memberof ParticipantStudy
     */
    imageId?: string;
    /**
     * Description of how the study benefits participants
     * @type {string}
     * @memberof ParticipantStudy
     */
    benefits?: string;
    /**
     * An integer that describes the sort order for this study
     * @type {number}
     * @memberof ParticipantStudy
     */
    readonly featuredOrder?: number;
    /**
     * Is this study highlighted?
     * @type {boolean}
     * @memberof ParticipantStudy
     */
    readonly isHighlighted?: boolean;
    /**
     * Is this a welcome study?
     * @type {boolean}
     * @memberof ParticipantStudy
     */
    readonly isWelcome?: boolean;
    /**
     * Is the study hidden from participants
     * @type {boolean}
     * @memberof ParticipantStudy
     */
    isHidden?: boolean;
    /**
     * Did the participant consent
     * @type {boolean}
     * @memberof ParticipantStudy
     */
    readonly consented?: boolean;
    /**
     * When the study was launched; null means not launched
     * @type {Date}
     * @memberof ParticipantStudy
     */
    readonly firstLaunchedAt?: Date;
    /**
     * When the study opens for participation; null means not open.
     * @type {Date}
     * @memberof ParticipantStudy
     */
    opensAt?: Date | null;
    /**
     * When the study closes for participation; null means does not close.
     * @type {Date}
     * @memberof ParticipantStudy
     */
    closesAt?: Date | null;
    /**
     * Desired sample size set by researcher
     * @type {number}
     * @memberof ParticipantStudy
     */
    targetSampleSize?: number | null;
    /**
     * Status of the study
     * @type {string}
     * @memberof ParticipantStudy
     */
    readonly status?: ParticipantStudyStatusEnum;
    /**
     * The study's researchers.
     * @type {Array<Researcher>}
     * @memberof ParticipantStudy
     */
    researchers?: Array<Researcher>;
    /**
     * How many times the study has been viewed
     * @type {number}
     * @memberof ParticipantStudy
     */
    viewCount?: number;
    /**
     * When the study becomes public for sharing with other researchers.
     * @type {Date}
     * @memberof ParticipantStudy
     */
    publicOn?: Date | null;
    /**
     * Number of times this study has been completed
     * @type {number}
     * @memberof ParticipantStudy
     */
    readonly completedCount?: number;
    /**
     * The category (type of) study
     * @type {string}
     * @memberof ParticipantStudy
     */
    category?: string;
    /**
     * 
     * @type {LearningPath}
     * @memberof ParticipantStudy
     */
    learningPath?: LearningPath;
    /**
     * The study's subject
     * @type {string}
     * @memberof ParticipantStudy
     */
    subject?: string;
    /**
     * The study's stages.
     * @type {Array<Stage>}
     * @memberof ParticipantStudy
     */
    stages?: Array<Stage>;
    /**
     * How many times the study has been launched
     * @type {number}
     * @memberof ParticipantStudy
     */
    readonly launchedCount?: number;
    /**
     * The URL to which stages should return after completing
     * @type {string}
     * @memberof ParticipantStudy
     */
    readonly returnUrl?: string;
}


/**
 * @export
 */
export const ParticipantStudyStatusEnum = {
    Active: 'active',
    Paused: 'paused',
    Scheduled: 'scheduled',
    Draft: 'draft',
    WaitingPeriod: 'waiting_period',
    ReadyForLaunch: 'ready_for_launch',
    Completed: 'completed'
} as const;
export type ParticipantStudyStatusEnum = typeof ParticipantStudyStatusEnum[keyof typeof ParticipantStudyStatusEnum];


/**
 * Check if a given object implements the ParticipantStudy interface.
 */
export function instanceOfParticipantStudy(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "totalPoints" in value;
    isInstance = isInstance && "totalDuration" in value;
    isInstance = isInstance && "shortDescription" in value;

    return isInstance;
}

export function ParticipantStudyFromJSON(json: any): ParticipantStudy {
    return ParticipantStudyFromJSONTyped(json, false);
}

export function ParticipantStudyFromJSONTyped(json: any, ignoreDiscriminator: boolean): ParticipantStudy {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'popularityRating': !exists(json, 'popularity_rating') ? undefined : json['popularity_rating'],
        'isDemographicSurvey': !exists(json, 'is_demographic_survey') ? undefined : json['is_demographic_survey'],
        'isFeatured': !exists(json, 'is_featured') ? undefined : json['is_featured'],
        'isSyllabusContestStudy': !exists(json, 'is_syllabus_contest_study') ? undefined : json['is_syllabus_contest_study'],
        'abortedAt': !exists(json, 'aborted_at') ? undefined : (new Date(json['aborted_at'])),
        'completedAt': !exists(json, 'completed_at') ? undefined : (new Date(json['completed_at'])),
        'optedOutAt': !exists(json, 'opted_out_at') ? undefined : (new Date(json['opted_out_at'])),
        'totalPoints': json['total_points'],
        'totalDuration': json['total_duration'],
        'titleForParticipants': !exists(json, 'title_for_participants') ? undefined : json['title_for_participants'],
        'titleForResearchers': !exists(json, 'title_for_researchers') ? undefined : json['title_for_researchers'],
        'shortDescription': json['short_description'],
        'longDescription': !exists(json, 'long_description') ? undefined : json['long_description'],
        'internalDescription': !exists(json, 'internal_description') ? undefined : json['internal_description'],
        'imageId': !exists(json, 'image_id') ? undefined : json['image_id'],
        'benefits': !exists(json, 'benefits') ? undefined : json['benefits'],
        'featuredOrder': !exists(json, 'featured_order') ? undefined : json['featured_order'],
        'isHighlighted': !exists(json, 'is_highlighted') ? undefined : json['is_highlighted'],
        'isWelcome': !exists(json, 'is_welcome') ? undefined : json['is_welcome'],
        'isHidden': !exists(json, 'is_hidden') ? undefined : json['is_hidden'],
        'consented': !exists(json, 'consented') ? undefined : json['consented'],
        'firstLaunchedAt': !exists(json, 'first_launched_at') ? undefined : (new Date(json['first_launched_at'])),
        'opensAt': !exists(json, 'opens_at') ? undefined : (json['opens_at'] === null ? null : new Date(json['opens_at'])),
        'closesAt': !exists(json, 'closes_at') ? undefined : (json['closes_at'] === null ? null : new Date(json['closes_at'])),
        'targetSampleSize': !exists(json, 'target_sample_size') ? undefined : json['target_sample_size'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'researchers': !exists(json, 'researchers') ? undefined : ((json['researchers'] as Array<any>).map(ResearcherFromJSON)),
        'viewCount': !exists(json, 'view_count') ? undefined : json['view_count'],
        'publicOn': !exists(json, 'public_on') ? undefined : (json['public_on'] === null ? null : new Date(json['public_on'])),
        'completedCount': !exists(json, 'completed_count') ? undefined : json['completed_count'],
        'category': !exists(json, 'category') ? undefined : json['category'],
        'learningPath': !exists(json, 'learning_path') ? undefined : LearningPathFromJSON(json['learning_path']),
        'subject': !exists(json, 'subject') ? undefined : json['subject'],
        'stages': !exists(json, 'stages') ? undefined : ((json['stages'] as Array<any>).map(StageFromJSON)),
        'launchedCount': !exists(json, 'launched_count') ? undefined : json['launched_count'],
        'returnUrl': !exists(json, 'return_url') ? undefined : json['return_url'],
    };
}

export function ParticipantStudyToJSON(value?: ParticipantStudy | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'popularity_rating': value.popularityRating,
        'aborted_at': value.abortedAt === undefined ? undefined : (value.abortedAt.toISOString()),
        'completed_at': value.completedAt === undefined ? undefined : (value.completedAt.toISOString()),
        'opted_out_at': value.optedOutAt === undefined ? undefined : (value.optedOutAt.toISOString()),
        'total_points': value.totalPoints,
        'total_duration': value.totalDuration,
        'title_for_participants': value.titleForParticipants,
        'title_for_researchers': value.titleForResearchers,
        'short_description': value.shortDescription,
        'long_description': value.longDescription,
        'internal_description': value.internalDescription,
        'image_id': value.imageId,
        'benefits': value.benefits,
        'is_hidden': value.isHidden,
        'opens_at': value.opensAt === undefined ? undefined : (value.opensAt === null ? null : value.opensAt.toISOString()),
        'closes_at': value.closesAt === undefined ? undefined : (value.closesAt === null ? null : value.closesAt.toISOString()),
        'target_sample_size': value.targetSampleSize,
        'researchers': value.researchers === undefined ? undefined : ((value.researchers as Array<any>).map(ResearcherToJSON)),
        'view_count': value.viewCount,
        'public_on': value.publicOn === undefined ? undefined : (value.publicOn === null ? null : value.publicOn.toISOString()),
        'category': value.category,
        'learning_path': LearningPathToJSON(value.learningPath),
        'subject': value.subject,
        'stages': value.stages === undefined ? undefined : ((value.stages as Array<any>).map(StageToJSON)),
    };
}

