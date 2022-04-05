document.addEventListener('DOMContentLoaded', (event) => {
	addEventToDeleteTodo();
	addEventToEditTodo();
	addEventToSubmitNewTodoGroup();
	addEventToDeleteGroup();
	addEventToDeleteGroupConfirmation();
	addEventToEditGroup();
	addEventToEditGroupConfirmation();
	addEventToEditTodoConfirmation();
	addEventToSubmitDeleteTodo();
	addEventToCheckBox();
	addEventToAddTodo();
	addEventToSubmitAddTodo();
})

function addEventToEditTodoConfirmation() {
	$('#submitModifyButton').on('click', function () {
		var id = $("#idInputModify").val();
		var newlignDate = $("#dateInputModify").val();
		var newlignTitle = $("#titleInputModify").val();
		var newlignDetails = $("#descriptionInputModify").val();
		$.ajax({
			url: '/modifyTodo',
			type: 'POST',
			data: { "id": id, "limited_date": newlignDate, "title": newlignTitle, "description": newlignDetails },
			success: function (response) {

				alert('Task modified successfully.');
			},
			error: function (err) {

				alert('Something went wrong, please try again');
			}
		});
		$('#editTodoModal').modal('hide');
	});
}

function addEventToEditGroupConfirmation() {
	$('#submitEditTodoGroupButton').on('click', function () {
		var id = $("#groupId").val();
		var group = $("#editInputGroupName").val();
		var color = $("#editColorGroupSelect").val();
		if (group === "") {
			alert("Group name cannot be empty");
		}
		else {
			$.ajax({
				url: '/editTodoGroup',
				type: 'POST',
				data: { "groupId": id, "color": color, "group": group },
				success: function (response) {
					alert('Group edited successfully.');
				},
				error: function (err) {
					alert('Something went wrong, please try again');
				}
			});
			$('#editGroupModal').modal('hide');
		}

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
	$('.deleteButtonGroup').on('click', function () {
		var id = $("#hElementForId").text();
		$.ajax({
			url: '/deleteGroup',
			type: 'DELETE',
			data: { "groupId": id },
			success: function (response) {
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
		if (groupInputName === "") {
			alert("Group name cannot be empty");
		}
		else {
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
		}
	});

}


function addEventToDeleteTodo() {
	$('.deleteButton').on('click', function () {
		var title = $(this).closest(".divTableRow").find("#lignTitle").text();
		var id = $(this).closest(".divTableRow").find("#lignId").text();
		$("#modal_body").html(title);
		$("#modal_body2").html(id);
		$('#deleteConfirmation').modal('show');
	});
}


function addEventToSubmitDeleteTodo() {
	$('.deleteButton2').on('click', function () {
		var id = $("#modal_body2").text();
		$.ajax({
			url: '/deleteTask',
			type: 'DELETE',
			data: { "taskId": id },
			success: function (response) {
				alert('Task removed successfully.');
			},
			error: function (err) {
				alert('Something went wrong, please try again');
			}
		});
		$('#deleteConfirmation').modal('hide');
	});
}

function addEventToEditTodo() {
	$('.editButton').on('click', function () {
		var lignId = $(this).closest(".divTableRow").find("#lignId").text();
		var groupName = $("#groupNameP").text();
		var lignDate = $(this).closest(".divTableRow").find("#lignDate").text();
		var lignTitle = $(this).closest(".divTableRow").find("#lignTitle").text();
		var lignDetails = $(this).closest(".divTableRow").find("#lignDetails").text();

		$("#idInputModify").val(lignId);
		$("#titleInputModify").val(lignTitle);
		$("#dateInputModify").val(lignDate);
		$("#groupInputModify").val(groupName);
		$("#descriptionInputModify").val(lignDetails);
		$('#editTodoModal').modal('show');
	});
}



function addEventToAddTodo() {
	$('.addTodoButton').on('click', function () {
		$('#addTodoModal').modal('show');
	});
}

function addEventToSubmitAddTodo() {
	$('#addButtonSubmit').on('click', function () {
		var groupName = $("#groupNameP").text();
		var groupId = $('#groupNameP').attr('class');

		var newTitleTodo = $("#titleInputAdd").val();
		var newDateTodo = $("#dateInputAdd").val();
		var newDescriptionTodo = $("#descriptionInputAdd").val();

		if (newTitleTodo === "") {
			alert("Title task cannot be empty");
		}
		else {
			$.ajax({
				url: '/addNewTodo',
				type: 'POST',
				data: { "groupId": groupId, "groupName": groupName, "title": newTitleTodo, "limited_date": newDateTodo, "description": newDescriptionTodo },
				success: function (response) {
					alert('Task added successfully.');
				},
				error: function (err) {

					alert('Something went wrong, please try again');
				}
			});
			$('#addTodoModal').modal('hide');
		}
	});
}


function addEventToCheckBox() {
	$('.checkboxTodo').on('click', function () {
		var checkboxDataId = $(this).val();
		if (!$(this).is(':checked')) {
			$.ajax({
				url: '/changeTodoStatus',
				type: 'POST',
				data: { "taskId": checkboxDataId },
				success: function (response) {

					alert('Todo status has been changed successfully.');
				},
				error: function (err) {

					alert('Something went wrong, please try again');
				}
			});
		}
		else {
			$.ajax({
				url: '/changeTodoStatusToDone',
				type: 'POST',
				data: { "taskId": checkboxDataId },
				success: function (response) {

					alert('Todo status has been changed successfully.');
				},
				error: function (err) {

					alert('Something went wrong, please try again');
				}
			});
		}
	});
}