document.addEventListener('DOMContentLoaded', (event) => {

	addEventToDeleteTodo();
	addEventToEditTodo();
	other();

	addEventToSubmitNewTodoGroup();

	addEventToDeleteGroup();
	addEventToDeleteGroupConfirmation();

	addEventToEditGroup()
	addEventToEditGroupConfirmation()
	

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

function addEventToEditGroupConfirmation() {
	$('#submitEditTodoGroupButton').on('click', function () {
		var id = $("#groupId").val();
		var group = $("#editInputGroupName").val();
		var color = $("#editColorGroupSelect").val();
		$.ajax({
			url: '/editTodoGroup',
			type: 'POST',
			data: { "groupId": id, "color": color, "group":group},
			success: function (response) {
				alert('Group edited successfully.');
			},
			error: function (err) {
				alert('Something went wrong, please try again');
			}
		});
		$('#editGroupModal').modal('hide');
	});
}

function addEventToEditGroup() {
	$('.editGroupButton').on('click', function () {
		var id = $(this).val();
		$.ajax({
			url: '/getGroupInfo',
			type: 'POST',
			data: { "groupId": id },
			success: function (response) {
				$("#editInputGroupName").val(response.group);
				$("#editColorGroupSelect").val(response.color);
				$("#creationDateInput").val(response.creationDate);
				$("#groupId").val(response._id);
			},
		});
		$('#editGroupModal').modal('show');
	});
}

function addEventToDeleteGroupConfirmation() {
	$('#deleteButtonGroupConfirmation').on('click', function () {
		var id = $("#hElementForId").text();
		$.ajax({
			url: '/deleteGroup',
			type: 'DELETE',
			data: { "groupId": id },
			success: function (response) {
				$("#" + response).remove();
				alert('Group removed successfully.');
			},
			error: function (err) {

				alert('Something went wrong, please try again');
			}
		});
		$('#deleteGroupConfirmation').modal('hide');

	});
}

function addEventToDeleteGroup() {
	$('.deleteGroupButton').on('click', function () {
		var id = $(this).val();
		$("#hElementForId").html(id);
		$('#deleteGroupConfirmation').modal('show');
	});
}

function addEventToSubmitNewTodoGroup() {
	$('#submitNewTodoGroupButton').on('click', function () {
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