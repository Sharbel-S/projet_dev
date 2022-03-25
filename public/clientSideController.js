document.addEventListener('DOMContentLoaded', (event) => {

	addEventToDeleteTodo();
	addEventToEditTodo();
	other();

	addEventToSubmitNewTodoGroup();



	/*
	addEventSubmitNewTodoButton();
	$('#box').append(
		$('<div/>')
			.attr("id", "newDiv1")
			.addClass("newDiv purple bloated")
			.append("<span/>")
			.text("hello world")
	);
		*/
})

function addEventToSubmitNewTodoGroup() {
	$('#submotNewTodoGroupButton').on('click', function () {
		var groupInputName = $("#groupInputName").val();
		var colorGroupSelect = $("#colorGroupSelect").val();
		$.ajax({
			url: '/addNewTodoGroup',
			type: 'POST',
			data: { "group": groupInputName, "color": colorGroupSelect },
			success: function (response) {

				alert('Group added successfully.');
			},
			error: function (err) {

				alert('Something went wrong, please try again');
			}
		});
		$('#addGroupModal').modal('hide');
	});

}


function addEventSubmitNewTodoButton() {
	$('#addButton').on('click', function () {
		var newlignGroup = $("#groupInputAdd").val();
		var newlignDate = $("#dateInputAdd").val();
		var newlignTitle = $("#titleInputAdd").val();
		var newlignDetails = $("#descriptionInputAdd").val();
		var newlignGroupSelect = $("#select").val();
		if (newlignTitle == "") {
			alert("Title cannot be empty")
		}
		else {
			console.log("ssss");
		}
	});
}

function addEventToDeleteTodo() {
	$('.deleteButton').on('click', function () {
		var book_code_call = $(this).closest(".divTableRow").find("#lignTitle").text();
		$("#modal_body").html(book_code_call);
		$('#deleteConfirmation').modal('show');
	});
}

function addEventToEditTodo() {
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
}

function other() {

	$('.deleteButton2').on('click', function () {
		var id = $("#lignId").text();
	});



	$('#modifyButton').on('click', function () {
		var newlignGroup = $("#titleInputModify").val();
		var newlignDate = $("#dateInputModify").val();
		var newlignTitle = $("#titleInputModify").val();
		var newlignDetails = $("#descriptionInputModify").val();;

	});


	$('.checkboxTodo').on('click', function () {
		var checkboxDataId = $(this).val();
		if (!$(this).is(':checked')) {
			console.log("checked");
		}
		else {
			console.log("non");
		}
	});

	$("#groupInputAdd").on("input", function () {
		if (this.value === "") {
			$("#select").prop("disabled", false);
		}
		else {
			$("#select").prop("disabled", true);
		}
	});

	$("#select").on("input", function () {
		if (this.value != "Select group") {
			$("#groupInputAdd").prop("disabled", true);
		}
		else {
			$("#groupInputAdd").prop("disabled", false);

		}
	});
}