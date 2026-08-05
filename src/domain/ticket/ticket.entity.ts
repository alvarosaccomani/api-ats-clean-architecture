export interface TicketEntity {
    tic_uuid: string,
    usr_uuid: string | null,
    app_uuid: string,
    tic_type: string,
    tic_title: string,
    tic_description: string | null,
    tic_status: string | null,
    tic_priority: string | null,
    tic_metadata: string | null,
    tic_admincomment: string | null,
    tic_images: string[] | null,
    tic_createdat: Date,
    tic_updatedat: Date
}

//Update
export type TicketUpdateData = Pick<TicketEntity, 'app_uuid' | 'tic_type' | 'tic_title' | 'tic_description' | 'tic_status' | 'tic_priority' | 'tic_metadata' | 'tic_admincomment' | 'tic_images'>
