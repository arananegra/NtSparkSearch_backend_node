const axios = require('axios');
const parseString = require('xml2js').parseString;

function getDataTest(id) {
    return axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id='+id+'&retmode=xml')
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error);
        });
}

getDataTest("251").then((responseFromService) => {
    parseString(responseFromService, function (err, result) {
        let geneRegion = result['Entrezgene-Set']["Entrezgene"][0]["Entrezgene_locus"][0]["Gene-commentary"][0]
            ["Gene-commentary_seqs"][0]["Seq-loc"][0]['Seq-loc_int'][0]['Seq-interval'];



    });

});



