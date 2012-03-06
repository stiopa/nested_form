function new_row(id) { 
    // Setup
    var assoc   = $("#"+id).attr('data-association');            // Name of child
    var content = $('#' + assoc + '_fields_blueprint').html(); // Fields template

    // Make the context correct by replacing new_<parents> with the generated ID
    // of each of the parent objects
    var context = ($("#"+id).closest('.fields').find('input:first').attr('name') || '').replace(new RegExp('\[[a-z]+\]$'), '');

    // context will be something like this for a brand new form:
    // project[tasks_attributes][new_1255929127459][assignments_attributes][new_1255929128105]
    // or for an edit form:
    // project[tasks_attributes][0][assignments_attributes][1]
    if(context) {
        var parent_names = context.match(/[a-z_]+_attributes/g) || [];
        var parent_ids   = context.match(/(new_)?[0-9]+/g) || [];

        for(i = 0; i < parent_names.length; i++) {
        if(parent_ids[i]) {
            content = content.replace(
            new RegExp('(_' + parent_names[i] + ')_.+?_', 'g'),
            '$1_' + parent_ids[i] + '_');

            content = content.replace(
            new RegExp('(\\[' + parent_names[i] + '\\])\\[.+?\\]', 'g'),
            '$1[' + parent_ids[i] + ']');
        }
        }
    }

    // Make a unique ID for the new child
    var regexp  = new RegExp('new_' + assoc, 'g');
    var new_id  = new Date().getTime();
    content     = content.replace(regexp, "new_" + new_id);
    //console.log(content);

    var field = $(content).insertBefore("#"+id);

    //value_for_row - this value will be put to your hidden_field's value
    //field_name - name of your hidden_field for example you have: id = "organization_occupation_educations_attributes_new_1331023751917_absolute". Atribute field_name will be "absolute"

    //put value from value_from_row
    if ($("#"+id).attr("field_name") != ""){
        var id_formula = field.find('input:first').attr('id').split("_new_")[0];
        $('#'+ id_formula + '_new_' + new_id + '_' + $("#"+id).attr("field_name")).attr("value", $("#"+id).attr("value_for_row"));
    }
    $("#"+id).closest("form").trigger({type: 'nested:fieldAdded', field: field});
    return true;
};

jQuery(function($){
    $("body").delegate("form a.remove_nested_fields", "click", function(){
        var hidden_field = $(this).prev('input[type=hidden]')[0];
        if(hidden_field) {
        hidden_field.value = '1';
        }
        $(this).closest('.fields').hide();
        $(this).closest("form").trigger('nested:fieldRemoved');
        return false;
    });
});
