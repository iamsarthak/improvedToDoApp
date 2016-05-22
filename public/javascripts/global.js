
// Userlist data array for filling in info box
var userListData = [];

  var newtaskname;
    var newlocation;
    var newtime_value;
    var newdate_value;
    

   var myvar=setInterval(timeCheck,1000);


// DOM Ready =============================================================
$(document).ready(function() {
   /* $('#inputTime').timepicker({    showPeriodLabels: false
});*/
   /* $('#inputDate').DatePicker({
        format:'m/d/Y',
	date: $('#inputDate').val(),
	current: $('#inputDate').val(),
	starts: 1,
	position: 'r',
	onBeforeShow: function(){
		$('#inputDate').DatePickerSetDate($('#inputDate').val(), true);
	},
	onChange: function(formated, dates){
		$('#inputDate').val(formated);
		
	}
    });*/
    timeCheck();
    // Populate the user table on initial page load
    populateTable();

});

$('#btnAddTask').on('click', addTask);
  // Delete task link click
    $('#userList table tbody').on('click', 'td a.linkdeletetask', deletetask);
    $('#reminder ul').on('click','li a.linkdeletetask',deletetask);
    $('#reminder ul').on('click','li a.linkpostponetask',postponetask);


// Functions =============================================================

// Fill table with data
function populateTable() {
  // Empty content string
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
                //console.log(this.time_value);

            tableContent += '<tr>';
            tableContent += '<td>' + this.taskname + '</td>';
            tableContent += '<td>' + this.location + '</td>';
            tableContent += '<td><a href="#" class="linkdeletetask" rel="' + this._id + '">done with?<a></td>';
            tableContent += '<td>' + this.time_value + '</td>';
            tableContent += '<td>' + this.date_value + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};



//timeCheck
function timeCheck(){
                    remindercontent='upcoming tasks';

    console.log("time check starts");
    $.getJSON( '/users/userlist', function( data ) {

    $.each(data, function(){
                var currTime=new Date();
                var currMonth= currTime.getMonth()+1;
                var currDate=currTime.getDate();
                var currHour=currTime.getHours();
                var currMinutes=currTime.getMinutes();
                var currYear=currTime.getFullYear();
                console.log("for current:="+'year='+currYear+'month='+currMonth+'date'+currDate+'hour'+currHour+'minutes'+currMinutes);
                var task_time_year=this.date_value.slice(0,4);
                var task_time_month=this.date_value.slice(5,7);
                var task_time_day=this.date_value.slice(8,10);    
                //console.log("for task:="+'year='task_time_year+'month='+task_time_month+'day='+task_time_day+'hour='+task_time_hour+'minutes='+task_time_minutes);
                var task_time_hour=this.time_value.slice(0,2);
                var task_time_minutes=this.time_value.slice(3);
                var hour_diff=task_time_hour-currHour;
                var minutes_diff=task_time_minutes-currMinutes;
                console.log('hour diff='+hour_diff);
                console.log('minutes diff='+minutes_diff);
                console.log(currYear==task_time_year);
                console.log(currMonth==task_time_month);
                console.log(currDate==task_time_day);
               

                if (currYear==task_time_year && currMonth==task_time_month && currDate==task_time_day){
                    console.log("in first condition");
                    hour_diff=task_time_hour-currHour;
                    minutes_diff=task_time_minutes-currMinutes;
                    console.log(hour_diff + 'min diff'+ minutes_diff);
                    if(hour_diff===1)
                        {
                            console.log("in second condition");
                            if(minutes_diff<=-45 && minutes_diff>= -60 )
                                {
                                                     remindercontent +='<li>'+ this.taskname +'  :-  ' +'<a href="#" class="linkdeletetask" rel="' + this._id + '">done with?</a> or <a href="#" class="linkpostponetask" rel="' + this._id + '">postpone?</a></h5></li>';


                                }
                        }
                    if(hour_diff===0)
                        {
                            console.log("in second condition");
                            if(minutes_diff>=0 && minutes_diff<=15)
                                {
                                remindercontent +='<li>'+ this.taskname +'  :-  ' +'<a href="#" class="linkdeletetask" rel="' + this._id + '">done with?</a> or <a href="#" class="linkpostponetask" rel="' + this._id + '">postpone?</a></h5></li>';

                                }
                        }
                }
                 });
                                                $('#reminder ul').html(remindercontent);
 
});
};

//Add Task


function addTask(event){
	event.preventDefault();
	    
    // Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addTask input').each(function(index, val) {
       	   	 if($(this).val() === '') { errorCount++; }
    		 });
	 // Check and make sure errorCount's still at zero
   	 if(errorCount === 0) {

        	// If it is, compile all user info into one object
        	var newTask = {
            	'taskname': $('#addTask fieldset input#inputTaskName').val(),
            	'location': $('#addTask fieldset input#inputLocation').val(),
                'time_value':$('#addTask fieldset input#inputTime').val(),
                'date_value':$('#addTask fieldset input#inputDate').val()
		}
		


        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newTask,
            url: '/users/addtask',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addTask fieldset input').val('');

                // Update the table
                populateTable();
                timeCheck();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};






// Delete task
function deletetask(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this task?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deletetask/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
            timeCheck();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};


function postponetask(event){
  
        newtaskid=$(this).attr('rel');

    
    $.getJSON( '/users/userlist', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
                //console.log(this.time_value);
            if(this._id===newtaskid)
            {
                newtaskname=this.taskname;
                //console.log(newtaskname);
                newlocation=this.location;
               // console.log(newlocation);
                newtime_value=this.time_value;
                newdate_value=this.date_value;
            }
        });

                            console.log(newlocation);

        var new_date_year=newdate_value.slice(0,4);
        new_date_year=parseInt(new_date_year,10);
        console.log(new_date_year);
        
                var new_date_month=newdate_value.slice(5,7);
        new_date_month=parseInt(new_date_month,10);
            console.log(new_date_month);
                var new_date_day=newdate_value.slice(8,10);
        new_date_day=parseInt(new_date_day,10);
            console.log(new_date_day);
        
        var flag=0;
    if(newdate_value.slice(5,7)==12 && newdate_value.slice(8,10)==31) //to handle 31st dec and postpone
        {
            flag=1;
            new_date_year+=1;
            new_date_month='01';
            new_date_day='01';
        }
    
    if(newdate_value.slice(5,7)==12 && newdate_value.slice(8,10)!=31) //to handle  dec and postpone
        {
            flag=1;
            new_date_day+=1;
        }    
        
        
        
    if(newdate_value.slice(5,7)==01 || newdate_value.slice(5,7)==03 || newdate_value.slice(5,7)==05 || newdate_value.slice(5,7)==07 || newdate_value.slice(5,7)==08 || newdate_valueslice(5,7)==10 )
        {
            console.log("in 31st' months" + "flag : " + flag);
            if(newdate_value.slice(8,10)==31)
                {
                    console.log("in 31st' months" + "flag : " + flag);
                    flag=1;
                    new_date_month+=1;
                    new_date_day='01';
                }
        }

     if(newdate_value.slice(5,7)==02 || newdate_value.slice(5,7)==04 || newdate_value.slice(5,7)==06 || newdate_value.slice(5,7)==09 || newdate_value.slice(5,7)==11)
        {
             console.log("in 30st' months" + "flag : " + flag);
            if(newdate_value.slice(8,10)==30)
                {
                    flag=1;
                    new_date_month+=1;
                    new_date_day='01';
                }
        }
    if (flag==0){
         console.log("in normal months" + "flag : " + flag);
        new_date_day+=01;
        console.log("new date"+new_date_day);
    }
    var newdatewhole;
        if(new_date_month.length==1)
            {
                new_date_month='0'+new_date_month;
            }
        if(new_date_day.length==1)
            {
                new_date_day='0'+new_date_day;
            }
        
    var newdatewhole=new_date_year+'-'+new_date_month+'-'+new_date_day;
    console.log(newdatewhole);
    
    
        	var newPostponeTask = {
            	'taskname': newtaskname,
            	'location': newlocation,
                'time_value':newtime_value,
                'date_value':newdatewhole
		}
        
        
        
        
        
        
     $.ajax({
            type: 'POST',
            data: newPostponeTask,
            url: '/users/addtask',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addTask fieldset input').val('');

                // Update the table
                alert("task postponed to 1 day")
                populateTable();
                timeCheck();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });    
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    });
    
    
     $.ajax({
            type: 'DELETE',
            url: '/users/deletetask/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
     });
    populateTable();
    timeCheck();
};
