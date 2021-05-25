$(function(){

    function chartData(s) {
        var a = s.map(function (d) { return { "loc": d.loc.name } })
        var counts = _.countBy(a, 'loc');
        var data = _.map(counts, function (value, key) {
            return {
                x: key,
                y: value
            };
        });
        return _.sortBy(data, 'y').reverse()
    }

    function mapData(s) {
        return s.map(function (d) {
            return {
                "location": [d.loc.latitude, d.loc.longitude],
                "tooltip": {
                    "text": d.record.titre
                }
            }
        })
    }

    var gridStore = new DevExpress.data.CustomStore({
        // key: "OrderNumber",
        load: function () {
            var d = new $.Deferred();
            $.get(unicasAPI)
                .done(function (response) {
                   var data = response.unicas ;
                   d.resolve(data)
                })
            return d.promise();
        }
    })
    var chartStore = new DevExpress.data.CustomStore({
        // key: "OrderNumber",
        load: function () {
            var d = new $.Deferred();
            $.get(unicasAPI)
                .done(function (response) {
                   var data = chartData(response.unicas) ;
                   d.resolve(data)
                })
            return d.promise();
        }
    })
    var mapStore = new DevExpress.data.CustomStore({
        // key: "OrderNumber",
        load: function () {
            var d = new $.Deferred();
            $.get(unicasAPI)
                .done(function (response) {
                   var data = mapData(response.unicas) ;
                   d.resolve(data)
                })
            return d.promise();
        }
    })

    $("#chart").dxChart({
        dataSource: chartStore,
        series: {
            argumentField: "x",
            valueField: "y",
            name: "Nombre d'unicas",
            type: "bar",
            color: '#ffaa66'
        },
        argumentAxis: {
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 45
            }
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.argumentText + " - " + arg.valueText
                };
            }
        }
    })

    $("#grid").dxDataGrid({
        dataSource: gridStore,
            showBorders: true,
            requireTotalCount: false,
            showBorders: true,
            rowAlternationEnabled: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: false,
            columnFixing: {
                enabled: false
            },
            "export": {
                enabled: true,
                fileName: "unicas"
            },
            columnChooser: {
                enabled: true,
                mode: "select"
            },
            sorting: {
                mode: "multiple"
            },
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 20, 50, 100, 150],
                showInfo: true
            },
            headerFilter: {
                visible: true
              },
            filterPanel: { visible: true },
            searchPanel: {
                visible: true
            },
            groupPanel: {
                emptyPanelText: "Glisser/déposer ici des en-têtes de colonnes pour effectuer des regroupements",
                visible: true
            },
            columns: [{
                caption: "PPN",
                dataField: "record.ppn",
                dataType: "string",
                cellTemplate: function (container, options) {
                    return $("<a>", { "href": "https://www.sudoc.fr/"+options.value, "target": "_blank" }).text(options.value);
                },
                headerFilter: {
                    allowSearch: true
                }
            },
            {
                caption: "Titre",
                dataField: "record.titre",
                dataType: "string",
                headerFilter: {
                    allowSearch: true
                }
            }, {
                caption: "ISSN",
                dataField: "record.issn",
                dataType: "string",
                headerFilter: {
                    allowSearch: true
                }
            }, {
                caption: "Contrôle 309",
                dataField: "record.controle",
                dataType: "string"
            }, {
                caption: "Bibliothèque",
                dataField: "loc.name",
                dataType: "string",
                headerFilter: {
                    allowSearch: true
                }
                //groupIndex: 0
            }, {
                caption: "Bib RCR",
                dataField: "loc.rcr",
                dataType: "string",
                headerFilter: {
                    allowSearch: true
                }
                //groupIndex: 0
            }, {
                caption: "Etat de collection (source Sudoc)",
                dataField: "loc.etat_de_collection",
                dataType: "string",
                headerFilter: {
                    allowSearch: true
                }
            }, {
                caption: "Notice Presse locale ancienne (source BnF)",
                dataField: "url_presselocale",
                cellTemplate: function (container, options) {
                    return $("<a>", { "href": options.value, "target": "_blank" }).text(options.value);
                },
                headerFilter: {
                    allowSearch: true
                }
            },
            {
                caption: "Numérisations (source BnF)",
                dataField: "numerisation",
                allowFiltering: true,
                cellTemplate: function (container, options) {
                    var t = (options.value || []).map(e => {
                      return e.etab + " (" + e.url + ")"
                    })
                    container.append("<div>" + t.join("|") + "</div>")
                  },
            }
           ],
            sortByGroupSummaryInfo: [{
                summaryItem: "count"
            }],
            summary: {
                totalItems: [{
                    column: "record.ppn",
                    summaryType: "count",
                    displayFormat: "{0} unicas"
                }],
                groupItems: [{
                    column: "record.ppn",
                    summaryType: "count",
                    displayFormat: "{0} unicas",
                }]
            }
    })
})