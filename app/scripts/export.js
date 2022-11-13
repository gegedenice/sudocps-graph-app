$(function(){
    $('.tabs').tabs();

    var storeBibs = new DevExpress.data.CustomStore({
        //loadMode: "raw",
        load: function () {
            var d = new $.Deferred();
            $.ajax({
                method: 'POST',
                url: graphAPI,
                data: getDataEncoded({ "q": "MATCH (b:Bib) RETURN distinct(b)" }),
                success: function (response) {
                    var data = response.map(function(d){
                        return {"rcr":d._fields[0].properties.rcr,"name":d._fields[0].properties.name}
                    })
                    d.resolve(data)
           }
    });
    return d.promise();
}
})

$("#selectbox-unicas-bibs").dxSelectBox({
    dataSource: storeBibs,
    placeholder: "Choisir sa bibliothèque",
    valueExpr: "rcr",
    displayExpr: "name",
    searchEnabled: true,
    onValueChanged: function (data) {     
        $("#selected_unicas_bibs").val(data.value)
            
    }
});
$("#selectbox-presselocale-bibs").dxSelectBox({
    dataSource: storeBibs,
    placeholder: "Choisir sa bibliothèque",
    valueExpr: "rcr",
    displayExpr: "name",
    searchEnabled: true,
    onValueChanged: function (data) {     
        $("#selected_presselocale_bibs").val(data.value)
            
    }
});
})

function getAllUnicas() {
    var result;
   $.getJSON( unicasAPI)
       .then(function(response){
          result =  parseUnicas(response.unicas)
          return result
       })
       .then(function(){
          const data = result
          const fileName = 'UnicasCR';
          const exportType = 'xls';
          window.exportFromJSON({ data, fileName, exportType }) 
       })
}

function getUnicasByRcr(rcr) {
    var result;
    $.getJSON( unicasAPI + "/rcr/"+rcr)
    .then(function(response){
        result =  parseUnicas(response.unicas)
        return result
     })
     .then(function(){
        const data = result
        const fileName = 'Unicas_'+rcr;
        const exportType = 'xls';
        window.exportFromJSON({ data, fileName, exportType }) 
     })
}

function getAllPresselocale() {
    $.getJSON( presselocaleAPI)
       .then(function(response){
          result =  parsePresselocale(response.presselocale)
          return result
       })
       .then(function(){
          const data = result
          const fileName = 'PresseLocaleAncienneCR';
          const exportType = 'xls';
          window.exportFromJSON({ data, fileName, exportType }) 
       })
}

function getPresselocaleByRcr(rcr) {
    var result;
    $.getJSON( presselocaleAPI + "/rcr/"+rcr)
     .then(function(response){
        if(response.presselocale.length != "0") {
          result = parsePresselocale(response.presselocale)
          return result
		
        .then(function(){
            const data = result
            const fileName = 'PresseLocaleAncienne_rcr';
            const exportType = 'xls';
            window.exportFromJSON({ data, fileName, exportType })
          }) 
        }
        else {
          alert("Pas de titre de presse locale ancienne pour cette bibliothèque !")
        }    
    })
}
function getPresselocaleByRcr(rcr) {
    var result;
    $.getJSON( presselocaleAPI + "/rcr/"+rcr)
     .then(function(response){
        if(response.presselocale.length != "0") {
          const adta = parsePresselocale(response.presselocale)
            const fileName = 'PresseLocaleAncienne_rcr';
            const exportType = 'xls';
            window.exportFromJSON({ data, fileName, exportType })
        }
        else {
          alert("Pas de titre de presse locale ancienne pour cette bibliothèque !")
        }    
    })
}
function parseUnicas(data) {
    return data.map(function (unica) {
        return {"titre":unica.record.titre,
                "ppn":unica.record.ppn,
                "issn":unica.record.issn,
                "309": unica.record.controle,
                "bibliothèque":unica.loc.name,
                "état de collection":unica.loc.etat_de_collection,
                "ark":unica.ark_bnf,
                "lien presse locale": unica.url_presselocale,
                "numerisation":unica.numerisation
                };   
    });
}

function parsePresselocale(data){
    return data.map(function (presselocale) {
        if(presselocale.sudoc_record){
          var ppn = presselocale.sudoc_record.ppn
          var url_sudoc = presselocale.sudoc_record.url_sudoc
          var bibs = presselocale.sudoc_locs.map(function(bib){return bib.name}).join("|")
        }
        if(presselocale.numerisation){
          var nums = presselocale.numerisation.map(function(num){return num.lieu+" : "+num.url;}).join("|")
        }
        return {"département":presselocale.depts_about.map(function(dept){return dept.name}).join("|"),
                "titre":presselocale.record.titre,
                "ark":presselocale.record.ark,
                "issn":presselocale.record.issn,
                "ppn":ppn,
                "lien Sudoc":url_sudoc,
                "bibliothèque":bibs,
                "numerisation":nums
                };   
    });
}