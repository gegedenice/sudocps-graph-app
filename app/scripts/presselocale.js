$(function(){

    function chartData(s) {
      var a = s.filter(function (d) { return d.sudoc_locs !== undefined })
        .filter(function (d) { return d.sudoc_locs.length > 0 })
        .map(function (d) { return d.sudoc_locs })
        .flat()
        .map(function (d) { return { "loc": d.name } })
      var counts = _.countBy(a, 'loc');
      var data = _.map(counts, function (value, key) {
        return {
          x: key,
          y: value
        };
      });
      return _.sortBy(data, 'y').reverse()
    }

    var gridStore = new DevExpress.data.CustomStore({
      // key: "OrderNumber",
      load: function () {
          var d = new $.Deferred();
          $.get(presselocaleAPI)
              .done(function (response) {
                 var data = response.presselocale ;
                 d.resolve(data)
              })
          return d.promise();
      }
  })
  var chartStore = new DevExpress.data.CustomStore({
      // key: "OrderNumber",
      load: function () {
          var d = new $.Deferred();
          $.get(presselocaleAPI)
              .done(function (response) {
                 var data = chartData(response.presselocale) ;
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
        name: "Nombre de titres de presse locale ancienne",
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
        fileName: "presselocaleancienne"
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
      filterRow: {
        visible: true,
        applyFilter: "auto"
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
        caption: "ARK",
        dataField: "record.ark",
        cellTemplate: function (container, options) {
          return $("<a>", { "href": "http://presselocaleancienne.bnf.fr" + options.value, "target": "_blank" }).text(options.value);
        }
      },
      {
        caption: "Titre",
        dataField: "record.titre",
        dataType: "string"
      }, {
        caption: "ISSN",
        dataField: "record.issn",
        dataType: "string"
      },
      {
        caption: "Zone d'édition (lieu|date)",
        dataField: "record.edition",
        dataType: "string"
      },
      {
        caption: "Départements concernés",
        dataField: "depts_about",
        cellTemplate: function (container, options) {
          var t = (options.value).map(e => {
            return e.name
          })
          container.append("<div>" + t.join("|") + "</div>")
        }
      },
      {
        caption: "Lien notice Sudoc",
        dataField: "sudoc_record.url",
        cellTemplate: function (container, options) {
          return $("<a>", { "href": options.value, "target": "_blank" }).text(options.value);
        }
      },
      {
        caption: "Contrôle 309",
        dataField: "sudoc_record.controle",
        dataType: "string"
      },
      {
        caption: "LocalisationsSudoc (dans le CR)",
        dataField: "sudoc_locs",
        cellTemplate: function (container, options) {
          var t = (options.value || []).map(e => {
            return e.name
          })
          container.append("<div>" + t.join("|") + "</div>")
        }
      },
      {
        caption: "Numérisation(s)",
        dataField: "numerisation",
        cellTemplate: function (container, options) {
          var t = (options.value || []).map(e => {
            return e.etab + " (" + e.url + ")"
          })
          container.append("<div>" + t.join("|") + "</div>")
        }
      }],
      sortByGroupSummaryInfo: [{
        summaryItem: "count"
      }],
      summary: {
        totalItems: [{
          column: "record.ark",
          summaryType: "count",
          displayFormat: "{0} presse locale"
        }],
        groupItems: [{
          column: "record.ark",
          summaryType: "count",
          displayFormat: "{0} presselocale",
        }]
    }
    })
})