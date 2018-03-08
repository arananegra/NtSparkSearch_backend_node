import {GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";


export const GeneType = new GraphQLObjectType({
    name: "gene",
    description: "This represent a gene object",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        geneId: {type: new GraphQLNonNull(GraphQLString)},
        sequence: {type: GraphQLString},
        hasSequence: {type: GraphQLBoolean}
    })
});