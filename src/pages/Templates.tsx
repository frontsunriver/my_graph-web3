import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, FormControl, FormLabel, Grid, GridItem, Heading, Icon, Input, SimpleGrid, useRadioGroup, Text } from '@chakra-ui/react';
import { HiOutlineCheckCircle, HiOutlineInformationCircle } from 'react-icons/hi';
import { GraphStateEnum } from '../enums/graphState';
import { RadioCard } from '../components/GraphCreation/RadioCard';
import { TemplateCard } from '../components/GraphCreation/TemplateCard';
import { GraphTemplate } from '../providers/responses/templateGraph';
import GraphService from '../services/graphService';
import { GraphCreation } from '../components/GraphCreation/GraphCreation';
import { SuspenseSpinner } from '../components/SuspenseSpinner';

interface TemplatesProps {

}

const Templates: React.FC<TemplatesProps> = ({ }) => {

    const [fileUpload, setFileUpload] = useState({ loaded: false, file: {} })
    const [graphName, setGraphName] = useState("")
    const [template, selectedTemplate] = useState({ loaded: false, template: { bytes: "", idgraphsTemplates: 0, title: "", description: "", customImg: "" } })
    const [templateLoaded, setTemplateLoaded] = useState(false)
    const [templates, setTemplates] = useState<GraphTemplate[]>([])

    useEffect(() => {
        const fetchTemplates = async () => {
            const templates: GraphTemplate[] = await GraphService.listGraphsTemplates()
            setTemplates(templates)
            setTemplateLoaded(true)
        }
        fetchTemplates()
    }, [])

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "template",
        onChange: (e) => {
            const template = templates.find(x => x.key === e)
            if (template !== undefined) {
                selectedTemplate({ loaded: true, template: template })
                console.log(template)
            }
        },
    })

    const group = getRootProps()

    const [step, setStep] = useState(true);

    const [graphData, setGraphData] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const fetchGraphData = async (template: any) => {
        return await GraphService.decompressGraph(template)
    }

    async function updateStep() {
        setIsLoading(true)
        fetchGraphData(template.template.bytes)
            .then(data => {
                setGraphData(JSON.parse(data))
                setStep(!step)
                setIsLoading(false)
            });
    }

    return (
        <>
            <h1>
                Template Wizard
                <GraphCreation className="bt">
                    Import .GLQ <i className="fal fa-upload"></i>
                </GraphCreation>
            </h1>
            <Alert status="info">
                <i className="fal fa-info-circle"></i> GraphLinq’s Instant Deploy Wizard lets you choose a template, fill in variables and deploy it instantly without having to code or making any changes on the IDE.
            </Alert>
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(3, 1fr)"]} gap={6}>
                <GridItem colSpan={2} rounded="xl" w="100%" h="full" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    {step &&
                        <TemplatesList isLoading={isLoading} templateLoaded={templateLoaded} group={group} template={template} templates={templates} getRadioProps={getRadioProps} fileUpload={fileUpload} graphName={graphName} setGraphName={setGraphName} updateStep={updateStep} />
                    }
                    {!step &&
                        <Suspense fallback="loading">
                            <TemplateVars templateData={graphData} graphName={graphName} templateName={template.template.title} templateDesc={template.template.description} step={step} setStep={setStep} />
                        </Suspense>
                    }
                </GridItem>
                <GridItem colSpan={1} rounded="xl" w="100%" minH="275" maxH="450px" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    <Box mx="auto" textAlign="center">
                        <Icon as={HiOutlineInformationCircle} color="#2334ff" w={8} h={8} />
                        <Heading size="md" color="#ece7fd" my="0.75rem">How to use a template ?</Heading>
                    </Box>
                    <Box as="ul" textAlign="left" mx="auto" mt="1rel">
                        <li style={{ marginTop: '.5rem', marginBottom: '.5rem' }}>You can :</li>
                        <li>- Select a template from the list</li>
                        <li>- Fill in required variables</li>
                        <li style={{ marginTop: '.5rem', marginBottom: '.5rem' }}>Or for more advanced user :</li>
                        <li>- Select a template</li>
                        <li>- Download it</li>
                        <li>- Upload & Edit On the <a href="https://ide.graphlinq.io/" target="_blank" style={{ color: "#2334ff" }}>IDE</a> to suit their needs</li>
                    </Box>
                    <Box mt="auto" mx="auto" textAlign="center">
                        You can also make your own custom Graph from scratch using our <a href="https://ide.graphlinq.io/" target="_blank" style={{ color: "#2334ff" }}>IDE</a>
                    </Box>
                </GridItem>
            </Grid>
        </>
    );
}

const TemplatesList = (props: any) => {

    return (
        <>
            <Heading size="md" color="#ece7fd" my="1rem">Name Your Graph :</Heading>
            <FormControl id="graphName" mb="2.5rem" isRequired>
                <Input type="text" variant="flushed" focusBorderColor="#2334ff" placeholder="Graph Name" value={props.graphName} onChange={(e) => { props.setGraphName(e.target.value) }} />
            </FormControl>
            <Heading size="md" color="#ece7fd" mb="1.75rem">Templates :</Heading>
            {props.templateLoaded
                ? < SimpleGrid className="ls-g" {...props.group} height="400px" overflowY="scroll">
                    {props.templates.map((template: any) => {
                        const radio = props.getRadioProps({ value: template.key })
                        return (
                            <RadioCard clickable={false} fileLoaded={props.fileUpload.loaded} key={template.key} {...radio}>
                                <TemplateCard TemplateImageUrl={template.customImg} TemplateImageAlt={template.description} TemplateTitle={template.title} />
                            </RadioCard>
                        )
                    })}
                </SimpleGrid>
                : <SuspenseSpinner />
            }
            {
                props.template.loaded &&
                <Box ml="auto" mt="0.75rem">
                    <Button as="a"
                        bgColor="transparent" variant="outline" borderColor="#aba1ca" color="#aba1ca" _hover={{ bgColor: "#2334ff", borderColor: '#2334ff', color: "white" }} mr="1rem"
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(props.template.template.bytes)}`}
                        download={`${props.template.template.key}.glq`}
                    >
                        Download .GLQ
                    </Button>
                    <Button as="a"
                        bgColor="transparent" variant="outline" borderColor="#aba1ca" color="#aba1ca" _hover={{ bgColor: "#2334ff", borderColor: '#2334ff', color: "white" }} mr="1rem"
                        href={`https://ide.graphlinq.io/?loadGraph=${props.template.template.idgraphsTemplates}`}
                        target="_blank"
                    >
                        Edit on IDE
                    </Button>
                    <Button bgColor="#2334ff" color="white" _hover={{ bgColor: "#202cc3" }} onClick={() => props.updateStep()} isDisabled={!props.graphName} isLoading={props.isLoading} loadingText="Loading">Next</Button>
                </Box>
            }
        </>
    );
}

interface TemplateRoot {
    name: string
    nodes: TemplateNode[]
    comments: any[]
}

interface TemplateNode {
    id: string
    type: string
    out_node?: string
    can_be_executed: boolean
    can_execute: boolean
    friendly_name: string
    block_type: string
    _x: number
    _y: number
    in_parameters: TemplateInParameter[]
    out_parameters: TemplateOutParameter[]
}

interface TemplateInParameter {
    id: string
    name: string
    type: string
    value: any
    assignment: string
    assignment_node: string
    value_is_reference: boolean
}

interface TemplateOutParameter {
    id: string
    name: string
    type: string
    value?: string
    assignment: string
    assignment_node: string
    value_is_reference: boolean
}

const TemplateVars = (props: any) => {

    const [decompTemplate, setDecompTemplate] = useState<TemplateRoot>(props.templateData)
    const [compressedTemplate, setCompressedTemplate] = useState<any>()

    const [fields, setFields] = useState(new Map())

    const handleChange = (i: any, v: any, node: TemplateNode) => {
        setFields(new Map(fields.set(i, v)));
        setDecompTemplate((decompTemplate) => {
            node.out_parameters[0].value = v
            return ({
                ...decompTemplate
            })
        })
    }

    useEffect(() => {
        decompTemplate?.nodes
            .filter(node => node.block_type === "variable" && node.friendly_name !== "do_not_show")
            .map((node, i: number) => (
                handleChange(i, node.out_parameters[0].value, node)
            ))
    }, [])

    const compressGraph = async (template: any) => {
        const compData = await GraphService.compressGraph(template)
        setCompressedTemplate(compData)
        return compData
    }

    const previous = () => {
        props.setStep(true)
        setFields(new Map())
    }

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    async function deployGraphTemplate(data: any, name: any) {
        try {
            const result: String | undefined = await GraphService.deployGraph({
                state: GraphStateEnum.Starting,
                bytes: data,
                alias: name,
                hash: undefined
            })

            if (result instanceof String) {
                setSuccess(`${result}`)
            } else {
                setError('Your graph file was incomplete or invalid, please check it on the IDE')
            }
        }
        catch (e) {
            console.error(e)
            setError('An error occured while trying to parse your file, please try again')
        }
        executeScroll()
    }

    async function deployTemplate() {
        setIsLoading(true)
        compressGraph(JSON.stringify(decompTemplate))
            .then(data => {
                deployGraphTemplate(data, props.graphName)
                setIsLoading(false)
            })
    }

    const resultRef = useRef<HTMLInputElement>(null)

    const executeScroll = () => resultRef.current?.scrollIntoView()

    return (
        <>
            {success &&
                <Alert status="success" mb="1rem" ref={resultRef}>
                    <Icon as={HiOutlineCheckCircle} color="#59b819" w="8" h="8" />
                    <p><b>Graph Successfully started, Congratulations !</b><br /><br />
                        {decompTemplate?.name || 'Template'} execution unique hash : {success}
                    </p>
                </Alert>
            }
            {error &&
                <Alert style={{ marginBottom: "15px", marginTop: "15px" }} status="error" ref={resultRef}>
                    <i className="fal fa-times-circle"></i>
                    <p>{error}</p>
                </Alert>
            }
            <Heading size="md" color="#ece7fd" mb="1rem">{props.graphName} :</Heading>
            <Text size="sm" color="#c4b9e5" mb=".5rem"><b>Template: </b>{props.templateName}</Text>
            <p><b>Description: </b>{props.templateDesc}</p>
            <form>
                {decompTemplate?.nodes
                    .filter(node => node.block_type === "variable" && node.friendly_name !== "do_not_show")
                    .map((node, i: number) => (
                        <FormControl my="2.5rem" id={node.id} key={node.id} isRequired>
                            <FormLabel>{node.friendly_name} :</FormLabel>
                            <Input id={node.id} key={node.id} type="text" variant="flushed" focusBorderColor="#2334ff" placeholder={node.friendly_name} value={fields.get(i) || node.out_parameters[0].value || ''} onChange={(e) => handleChange(i, e.target.value, node)} />
                        </FormControl>
                    ))}
            </form>
            <Box ml="auto" mt="auto">
                <Button bgColor="transparent" variant="outline" borderColor="#aba1ca" color="#aba1ca" _hover={{ bgColor: "#2334ff", borderColor: '#2334ff', color: "white" }} mr="1rem" onClick={previous}>Previous</Button>
                <Button bgColor="#2334ff" color="white" _hover={{ bgColor: "#202cc3" }} onClick={deployTemplate} isLoading={isLoading} loadingText="Loading">Deploy</Button>
            </Box>
            </>
    );
}

export default Templates;