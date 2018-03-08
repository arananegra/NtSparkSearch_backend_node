import {GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";


export const GeneType = new GraphQLObjectType({
    name: "Gene",
    description: "This represent a gene object",
    fields: () => ({
        _geneId: {type: new GraphQLNonNull(GraphQLString)},
        _sequence: {type: new GraphQLNonNull(GraphQLString)}
    })
});