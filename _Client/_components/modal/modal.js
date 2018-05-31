$(document).ready( function() { modalMain() 
    
    function modalMain()
    {

    }
})

function onModalYes()
{
    console.log( "Yes Not Overridden." )
}

function onModalNo()
{
    console.log( "No Not Overridden."  )
}

function editModalHeader( newText )
{
    $( "#modal-id-title" )[0].innerHTML = newText
}

function editModalContent( newText )
{
    $( "#modal-id-text" )[0].innerHTML = newText
}

function showModal()
{
    $( "#modalPopup" ).modal()
}

function hideModal()
{
    $('#modalPopup').modal('hide');
}