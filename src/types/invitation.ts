/* 
[
    {templates: {
        content: "",
        variables: [
            {},
            {},
            {},
        ]
    }},
    contacts: [
        {id: "", name: "", phone: ""},
        {id: "", name: "", phone: ""},
        {id: "", name: "", phone: ""},
    ]
]
*/

export interface TemplateVariable {
    map(arg0: (v: any) => any[]): Iterable<readonly [PropertyKey, any]>
    key: string
    value: string
}

export interface TemplateData {
    content: string
    variables: TemplateVariable[]
}

export interface Contact {
    id: number | string
    name: string
    phone: string | null
    isInvited?: boolean
}

export type GetInvitationsResponse = [
    { templates: TemplateData },
    { contacts: Contact[] }
]
