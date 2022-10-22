export interface GraphTemplate {
    idgraphsTemplates: number,
    customImg: string,
    title: string,
    key: string,
    bytes: string,
    description: string
}

export interface TemplateGraphResponse {
    success: boolean,
    templates: GraphTemplate[]
}