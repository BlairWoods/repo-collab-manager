import { Owner } from "./Owner";

export interface Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: Owner;
    url: string;
    collaborators_url: string;
    created_at: Date;
    updated_at: Date;
    pushed_at: Date;
    archived: boolean;
    disabled: boolean;
}
