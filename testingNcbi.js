const axios = require('axios');
const parseString = require('xml2js').parseString;

function getDataTest(id) {
    return axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id=' + id + '&retmode=xml')
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error);
        });
}

function getFasta(intervalId, startPos, endPost, strandSense) {
    return axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=' + intervalId +
        '&retmode=text' + "&seq_start=" + startPos + "&seq_stop=" + endPost + "&strand=" + strandSense + "&rettype=fasta")
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error);
        });
}

getDataTest("13").then((responseFromService) => {
    parseString(responseFromService, function (err, result) {
        let geneRegion = result['Entrezgene-Set']["Entrezgene"][0]["Entrezgene_locus"][0]["Gene-commentary"][0]
            ["Gene-commentary_seqs"][0]["Seq-loc"][0]['Seq-loc_int'][0]['Seq-interval'];
        let startPos = Number(geneRegion[0]["Seq-interval_from"][0]) + 1;
        let endPost = Number(geneRegion[0]["Seq-interval_to"][0]) + 1;

        let intervalId = geneRegion[0]["Seq-interval_id"][0]["Seq-id"][0]["Seq-id_gi"][0];

        let strandSense = geneRegion[0]["Seq-interval_strand"][0]["Na-strand"][0]["$"]["value"];
        strandSense === "minus" ? strandSense = 2 : strandSense = 1;

        getFasta(intervalId, startPos, endPost, strandSense).then(fastaResponse => {
            let fastaResponseWithoutHeader = fastaResponse.substring(fastaResponse.indexOf("\n") + 1);
            let fastaSingleLine = fastaResponseWithoutHeader.replace(/[\n]/g,"");
            console.log(fastaSingleLine)
        })
    });
});








