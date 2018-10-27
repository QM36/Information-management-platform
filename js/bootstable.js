/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/
  "use strict";
  //Global variables
var key = window.location.search.match(/(?!u)(key=)([^&]+)/);
var newColHtml = 
      `<div class="btn-group pull-right">
            <button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="rowEdit(this);">
                <span class="glyphicon glyphicon-pencil" > </span>
            </button>
            
            <button id="bElim" type="button" class="btn btn-sm btn-default" onclick="rowElim(this);" data-toggle="modal" data-target="#myModal">
                <span class="glyphicon glyphicon-trash" > </span>
            </button>
            
            <button id="bAcep" type="button" class="btn btn-sm btn-default"style="display:none;" data-toggle="modal" data-target="#myModal">
                <span class="glyphicon glyphicon-ok" > </span>
            </button>
            
            <button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowCancel(this);">
                <span class="glyphicon glyphicon-remove" > </span>
            </button>
       </div>`;
var colEdicHtml = `<td name="buttons">${newColHtml}</td>`;
if (!key) {
    window.location.href = "login.html";
}else {
    console.log("用户"+key[2]+"登录");
    // 获取用户信息
}

$.ajax({
    url: 'https://www.easy-mock.com/mock/5bc733bedc36971c160cabdb/manage/getallinfo',
    type: 'GET',
    dataType: 'json',
})
.done(function(response) {
    var html = "";
    for(var i = 0; i < response.data.length; i++) {
    html += `<tr>
                <td class="edit">${response.data[i].regId}</td>
                <td class="edit">${response.data[i].name}</td>
                <td class="edit">${response.data[i].institute}</td>
                <td class="edit">${response.data[i].major}</td>
                <td class="edit">${response.data[i].stuId}</td>
                <td class="edit">${response.data[i].email}</td>
                <td class="edit">${response.data[i].sex}</td>
                <td class="edit">${response.data[i].phone}</td>
                <td class="edit">${response.data[i].positionCode}</td>
                <td class="edit">${response.data[i].registrationTime}</td>
                <td name="info">
                <button type="button" class="btn btn-warning" title="个人简介"
                        data-container="body" data-toggle="popover" data-placement="top"
                        data-content="${(i === 0)?response.data[i].subject:((response.data[i].subject === response.data[i-1].subject)?"暂无数据，如需添加请点编辑按钮":response.data[i].subject)}">
                    查看详情
                </button>
                </td>
            </tr>`
    }
    console.log(response.data);
    $("#tbody").empty();
    $("#tbody").append(html);
    $('thead tr').append('<th name="buttons"></th>');  //encabezado vacío
    $('tbody tr').append(colEdicHtml);
    $("[data-toggle='popover']").popover();
})
.fail(function() {
    console.log("error");
})
.always(function() {
    console.log("获取数据结束");
});

$("#logout").click(function() {
    $.ajax({
        url: 'https://www.easy-mock.com/mock/5bc733bedc36971c160cabdb/manage/logout',
        type: 'GET',
        dataType: 'json',
    })
    .done(function(response) {
        if(response.code == 200) {
            window.location.href = "login.html";
        }
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("退出登录");
    });
});

var params = null; 
var colsEdi =null;
    
$.fn.SetEditable = function (options) {
    var defaults = {
        columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
        $addButton: null,        //Jquery object of "Add" button
        onEdit: function() {},   //Called after edition
    	onBeforeDelete: function() {}, //Called before deletion
        onDelete: function() {}, //Called after deletion
        onAdd: function() {}     //Called when added a new row
    };
    params = $.extend(defaults, options);

    var $tabedi = this;   //Read reference to the current table, to resolve "this" here.
    //Process "addButton" parameter
    if (params.$addButton != null) {
        //Se proporcionó parámetro
        params.$addButton.click(function() {
            rowAddNew($tabedi.attr("id"));
        });
    }
    //Process "columnsEd" parameter
    if (params.columnsEd != null) {
        //Extract felds
        colsEdi = params.columnsEd.split(',');
    }
};
function IterarCamposEdit($cols, tarea) {
//Itera por los campos editables de una fila
    var n = 0;
    $cols.each(function() {
        n++;
        if ($(this).attr('name')=='buttons') return;  //excluye columna de botones
        if (!EsEditable(n-1)) return;   //noe s campo editable
        tarea($(this));
    });
    
    function EsEditable(idx) {
    //Indica si la columna pasada está configurada para ser editable
        if (colsEdi==null) {  //no se definió
            return true;  //todas son editable
        } else {  //hay filtro de campos
//alert('verificando: ' + idx);
            for (var i = 0; i < colsEdi.length; i++) {
              if (idx == colsEdi[i]) return true;
            }
            return false;  //no se encontró
        }
    }
}
function FijModoNormal(but) {
    $(but).parent().find('#bAcep').hide();
    $(but).parent().find('#bCanc').hide();
    $(but).parent().find('#bEdit').show();
    $(but).parent().find('#bElim').show();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', '');  //quita marca
}
function FijModoEdit(but) {
    $(but).parent().find('#bAcep').show();
    $(but).parent().find('#bCanc').show();
    $(but).parent().find('#bEdit').hide();
    $(but).parent().find('#bElim').hide();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', 'editing');  //indica que está en edición
}
function ModoEdicion($row) {
    if ($row.attr('id')=='editing') {
        return true;
    } else {
        return false;
    }
}
 
function rowAcep(but) {
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    var elem = $cols.find('input');  //lee campos
    // console.log("修改信息为：");
    // console.log(elem[0].value);
    // console.log(elem[1].value);
    // console.log(elem[2].value);
    // console.log(elem[3].value);
    // console.log(elem[4].value);
    // console.log(elem[5].value);
    // console.log(elem[6].value);
    // console.log(elem[7].value);
    // console.log(elem[8].value);
    // console.log(elem[9].value);
    $.ajax({
        url: 'https://www.easy-mock.com/mock/5bc733bedc36971c160cabdb/manage/update',
        type: 'PUT',
        dataType: 'json',
        // data: {
        //     regId: elem[0].value,
        //     name: elem[1].value,
        //     institute: elem[2].value,
        //     major: elem[3].value,
        //     stuId: elem[4].value,
        //     email: elem[5].value,
        //     sex: elem[6].value,
        //     phone: elem[7].value,
        //     positionCode: elem[8].value,
        //     registrationTime: elem[9].value
        // },
    })
    .done(function(response) {
        if(response.code == 200) {
            if (!ModoEdicion($row)) return;  //Ya está en edición
            //Está en edición. Hay que finalizar la edición
            IterarCamposEdit($cols, function($td) {  //itera por la columnas
              var cont = $td.find('input').val(); //lee contenido del input
              $td.html(cont);  //fija contenido y elimina controles
            });
            FijModoNormal(but);
            params.onEdit($row);
            console.log("修改成功");
        } else {
            console.log("修改失败");
        } 
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("修改结束");
    });
}
$('#adm').click(rowAcep($('#bAcep')));
function rowCancel(but) {
//Rechaza los cambios de la edición
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
        var cont = $td.find('div').html(); //lee contenido del div
        $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
}
function rowEdit(but) {  //Inicia la edición de una fila
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('.edit');  //lee campos
    if (ModoEdicion($row)) return;  //Ya está en edición
    //Pone en modo de edición
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
        var cont = $td.html(); //lee contenido
        var div = '<div style="display: none;">' + cont + '</div>';  //guarda contenido
        var input = '<input class="form-control input-sm"  value="' + cont + '">';
        $td.html(div + input);  //fija contenido
    });
    FijModoEdit(but);
}
function rowElim(but) {  //Elimina la fila actual
    var $row = $(but).parents('tr');  //accede a la fila
    params.onBeforeDelete($row);
    $row.remove();
    params.onDelete();
}
function rowAddNew(tabId) {  //Agrega fila a la tabla indicada.
var $tab_en_edic = $("#" + tabId);  //Table to edit
    var $filas = $tab_en_edic.find('tbody tr');
    if ($filas.length==0) {
        //No hay filas de datos. Hay que crearlas completas
        var $row = $tab_en_edic.find('thead tr');  //encabezado
        var $cols = $row.find('th');  //lee campos
        //construye html
        var htmlDat = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
                htmlDat = htmlDat + colEdicHtml;  //agrega botones
            } else {
                htmlDat = htmlDat + '<td></td>';
            }
        });
        $tab_en_edic.find('tbody').append('<tr>'+htmlDat+'</tr>');
    } else {
        //Hay otras filas, podemos clonar la última fila, para copiar los botones
        var $ultFila = $tab_en_edic.find('tr:last');
        $ultFila.clone().appendTo($ultFila.parent());  
        $ultFila = $tab_en_edic.find('tr:last');
        var $cols = $ultFila.find('td');  //lee campos
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
            }else if ($(this).attr('name')=='info') {
                $("[data-toggle='popover']").popover();
            }else {
                $(this).html('');  //limpia contenido
            }
        });
    }
	params.onAdd();
}
function TableToCSV(tabId, separator) {  //Convierte tabla a CSV
    var datFil = '';
    var tmp = '';
	var $tab_en_edic = $("#" + tabId);  //Table source
    $tab_en_edic.find('tbody tr').each(function() {
        //Termina la edición si es que existe
        if (ModoEdicion($(this))) {
            $(this).find('#bAcep').click();  //acepta edición
        }
        var $cols = $(this).find('td');  //lee campos
        datFil = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
            } else {
                datFil = datFil + $(this).html() + separator;
            }
        });
        if (datFil!='') {
            datFil = datFil.substr(0, datFil.length-separator.length); 
        }
        tmp = tmp + datFil + '\n';
    });
    return tmp;
}
