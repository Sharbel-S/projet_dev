document.addEventListener('DOMContentLoaded', (event) => {
	$('.deleteButton').on('click', function () {
		var book_code_call = $(this).closest(".divTableRow").find("#lignTitle").text();
		$("#modal_body").html(book_code_call);
		$('#deleteConfirmation').modal('show');
	});

	$('.deleteButton2').on('click', function () {
		var id = $("#lignId").text();
	});

	$('.editButton').on('click', function () {
		var lignGroup = $(this).closest(".divTableRow").find("#lignGroup").text();
		var lignDate = $(this).closest(".divTableRow").find("#lignDate").text();
		var lignTitle = $(this).closest(".divTableRow").find("#lignTitle").text();
		var lignDetails = $(this).closest(".divTableRow").find("#lignDetails").text();
		$("#titleInputModify").val(lignTitle);
		$("#dateInputModify").val(lignDate);
		$("#groupInputModify").val(lignGroup);
		$("#descriptionInputModify").val(lignDetails);
		$('#editTodoModal').modal('show');

	});

	$('#modifyButton').on('click', function () {
		var newlignGroup = $("#titleInputModify").val();
		var newlignDate = $("#dateInputModify").val();
		var newlignTitle = $("#titleInputModify").val();
		var newlignDetails = $("#descriptionInputModify").val();;
	});

})
