import {GraphQLBoolean, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";
import {GeneType} from "./GeneType"

export const GeneListType = new GraphQLObjectType({
    name: "gene_list",
    description: "This represent a list of genes objects",
    fields: () => ({
        geneList: {type: new GraphQLList(GeneType)}
    })
});