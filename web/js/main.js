/*
author: wingkwong
*/
$(function() {
    var SCHEDULELAND = {};

    SCHEDULELAND.SAMPLE = {
        init: function() {
            //...
        },
        dummyFunction: function() {
            //...
        }
    };

    SCHEDULELAND.UTILS = {
        init: function() {

        },
        photoPreview: function() {
            $('.inputFile').change(function(event) {
                var preview = $('.imgSrc');
                var file = $('.inputFile')[0].files[0];
                var reader = new FileReader();
                reader.onload = function(event) {
                    preview.attr("src", reader.result);
                    $(".imgSrc").show();
                };
                reader.readAsDataURL(file);
            });
        }

    };

    SCHEDULELAND.PROFILE = {

        init: function() {
            console.log("SCHEDULELAND.PROFILE init() invoking...");
            var me = this;
            var clicks = 0;
			

			var file;
            var reader;
            var filename;
            var data;
		
            $('.inputFile').change(function(user) {
                var preview = $('.imgSrc');
                file = $('.inputFile')[0].files[0];
                reader = new FileReader();
                reader.onload = function(user) {
                    preview.attr("src", reader.result);
                    $(".imgSrc").show();
                    filename = file.name;
                    data = user.target.result;
                };
                reader.readAsDataURL(file);
            });
			
			$('.change-profile-btn').click(function(e) {
				var id = window.location.pathname.split("/")[2];
                e.preventDefault();
				
                

			
		console.log("SCHEDULELAND.PROFILE updateProfilePic() invoking...");
		
            $.ajax({
                type: 'POST',
                url: 'http://localhost:10880/updateProfilePic/'+id,
                data: {
					data:data,
                },
                success: function(data) {
					 
					
					$('.ProfilePicAlert').show();
                    $(window).scrollTop(0);
					
                    console.log('success', data);
                },
                error: function(err) {
			
				console.log('failed', err);				               
                }
				
            });
			
				
				
            });
			
			
            $('.change-pwd-btn').click(function(e) {
				var id = window.location.pathname.split("/")[2];
                e.preventDefault();
                me.updatePassword(id);
            });

			
            $('.change-email-btn').click(function(e) {
				e.preventDefault();
				var id = window.location.pathname.split("/")[2];                
				
                me.updateEmail(id);
				
            });

            $('.change-notification-btn').click(function(e) {
				var id = window.location.pathname.split("/")[2];
                e.preventDefault();
                me.updateNotification(id);
            });


            $('.add-friend-btn').click(function(e) {

                if (clicks == 0) {
                    // odd clicks


                    e.preventDefault();
                    var id = $(this).data("href");
                    me.addFriend(id);
                    $(".add-friend-btn").text("Cancel Friend request");
                    clicks++;
                } else {

                    // even clicks
                    e.preventDefault();
                    var id = $(this).data("href");
                    me.removeFriend(id);
                    $(".add-friend-btn").text("Add Friend");
                    clicks--;
                }

            });
            /*$('.add-friend-btn').click(function(e){
				 
				e.preventDefault();
				var id = $(this).data("href");
				me.addFriend(id);
		
			});
			
			$('.cancel-friend-btn').click(function(e){
				 
				e.preventDefault();
				var id = $(this).data("href");
				me.removeFriend(id);
		
			});*/
            $('.cancel-friend-btn').click(function(e) {

                if (clicks == 0) {
                    // odd clicks


                    e.preventDefault();
                    var id = $(this).data("href");
                    me.removeFriend(id);
                    $(".cancel-friend-btn").text("Add Friend");
                    clicks++;
                } else {

                    // even clicks
                    e.preventDefault();
                    var id = $(this).data("href");
                    me.addFriend(id);
                    $(".cancel-friend-btn").text("Cancel Friend request");
                    clicks--;
                }

            });
		
		$('.detail-btn').click(function(e){
		    console.log("SCHEDULELAND.PROFILE detail() invoking...");
			e.preventDefault();
			var id=$(this).attr("data-id");	
			console.log(id);
			//var id ="58ac3e224e2f6b05c0916903";
			window.location.href ="http://localhost:10880/activities/details/"+id;
                         
			});
		
			$('.rejectinvite-btn').click(function(e){
				e.preventDefault();
				var id=$(this).attr("data-id");	
				var uuid=window.location.pathname.split("/")[2];
				//$("form[data-id='" + id + "']").prop("hidden",true);
				me.rejectInvite(uuid,id);
					function redirect() {
                                window.location.href = "http://localhost:10880/user/"+uuid;
                            }
                            setTimeout(redirect, 1000);

			});
			
		$('.click-profile-btn').click(function(e){
			e.preventDefault();
			var id=$(this).attr("data-id");	
			function redirect() {
                                window.location.href = "http://localhost:10880/user/"+id;
                            }
                            setTimeout(redirect, 1000);
		});			
			
         $('.accept-btn').click(function(e){
				e.preventDefault();
				var id=$(this).attr("data-id");	
				var uuid=window.location.pathname.split("/")[2];				
				me.acceptFriend(id);
				function redirect() {
                                window.location.href = "http://localhost:10880/user/"+uuid;
                            }
                            setTimeout(redirect, 1000);
			});
			
			$('.friend-btn').click(function(e){
				e.preventDefault();					
				var uuid=window.location.pathname.split("/")[2];				
				//me.friendlist(uuid);
				function redirect() {
                            window.location.href = "http://localhost:10880/user/"+uuid+"/friends";
                            }
                            setTimeout(redirect, 1000);
			});
			
			
			$('.reject-btn').click(function(e){
				e.preventDefault();
				var id=$(this).attr("data-id");	
				var uuid=window.location.pathname.split("/")[2];
				//$("form[data-id='" + id + "']").prop("hidden",true);
				me.rejectAddFriend(id);
					function redirect() {
                                window.location.href = "http://localhost:10880/user/"+uuid;
                            }
                            setTimeout(redirect, 1000);

			});
            //Dick added
            $('.change-rating-btn').click(function(e) {
                e.preventDefault();
                var id = window.location.pathname.split("/")[2];
                me.updateScore(id);
            });
			
			


        },
	
		
        addFriend: function(id) {
            console.log("SCHEDULELAND.PROFILE addFriend() invoking...");

            $.ajax({
                type: 'PUT',
                url: 'http://localhost:10880/addFriend/' + id,
                success: function(data) {


                    console.log('success', data);

                    //TODO: alert the response
                },
                error: function(err) {
                    console.log('failed', err);
                }
            });
        },

        removeFriend: function(id) {
            console.log("SCHEDULELAND.PROFILE removeFriend() invoking...");

            $.ajax({
                type: 'PUT',
                url: 'http://localhost:10880/removeFriend/' + id,
                success: function(data) {

                    //$(.add-friend-btn).attr('disabled','disabled');
                    console.log('success', data);
                    
                    //TODO: alert the response
                },
                error: function(err) {
                    console.log('failed', err);
                }
            });
        },

        updateScore: function(id) {
            console.log("SCHEDULELAND.PROFILE updateScore() invoking...");

            var newScore = $("input[type='radio'].radioBtnClass:checked").val();


            $.ajax({
                type: 'POST',
                url: 'http://localhost:10880/updateScore/' + id,
                data: {
                    newScore: newScore,
                },
                success: function(data) {
                    $('.change-rating-btn').prop('disabled', true);
					$('.change-rating-btn').text("Submitted");
                    console.log('success', data);
                },
                error: function(err) {
                    console.log('failed', err);
                }
            });
        },

     acceptFriend:function(id){
			console.log("SCHEDULELAND.PROFILE acceptFriend() invoking...");
		
				$.ajax({
				type: 'PUT',
				url: 'http://localhost:10880/acceptFriend/'+id,
				data:{
					id : id
				},
				
				success: function(data) {
					//$(".id").hide();
					console.log('success', data);
				},
				error: function(err){
					console.log('failed', err);
				}
			});
		},
		rejectAddFriend:function(id){
			console.log("SCHEDULELAND.PROFILE rejectAddFriend() invoking...");
										
			$.ajax({
				type: 'PUT',
				url: 'http://localhost:10880/rejectAddFriend/' + id,
				data:{
					id : id
				},
				
				success: function(data) {
					
				
					console.log('success', data);
					//$("form").hasClass(id).hide();
					
					//TODO: alert the response
				},
				error: function(err){
					console.log('failed', err);
				
				}
			});
		},
		
		rejectInvite:function(uuid,id){
			console.log("SCHEDULELAND.PROFILE rejectAddFriend() invoking...");
										
			$.ajax({
				type: 'PUT',
				url: 'http://localhost:10880/rejectInvite/' + uuid,
				data:{
					uuid : uuid,
					id : id,
				},
				
				success: function(data) {				
					console.log('success', data);
					
				},
				error: function(err){
					console.log('failed', err);
				
				}
			});
		},
		
		
        updatePassword: function(id) {
            console.log("SCHEDULELAND.PROFILE updatePassword() invoking...");
            var newPwd = $('.newPwd').val();
            var oldPwd = $('.oldPwd').val();
            var rePwd = $('.rePwd').val();
		
            $.ajax({
                type: 'POST',
                url: 'http://localhost:10880/updatePassword',
                data: {
                    newPwd: newPwd,
                    oldPwd: oldPwd,
                    rePwd: rePwd
                },
                success: function(data) {
					
					 function redirect() {
                        window.location.href = "http://localhost:10880/user/"+id+"/edit";
						
                    }
                    setTimeout(redirect, 1000);
					 
                    //$('.edit-password input[type="password"]').val('');
                    console.log('success', data);
                },
                error: function(err) {
				$('.alert-success').hide();
				$('.alert-danger').hide();			
				$('.passwordalert').show();
				$(window).scrollTop(0);
				console.log('failed', err);				               
                }
				
            });
			
			
			
        },
        updateEmail: function(id) {
            console.log("SCHEDULELAND.PROFILE updateEmail() invoking...");

            var oldemailaddress = $('.oldemailaddress').val();
            var newemailaddress = $('.newemailaddress').val();
            $.ajax({
                type: 'PUT',
                data: {

                    oldemailaddress: oldemailaddress,
                    newemailaddress: newemailaddress,

                },
                url: 'http://localhost:10880/updateEmail',

                success: function(data) {
					 function redirect() {
                        window.location.href = "http://localhost:10880/user/"+id+"/edit";
                    }
                    setTimeout(redirect, 1000);
                    //$('.edit-emailaddress input[type="email"]').val('');
                    console.log('success', data);
                },
                error: function(err) {
				$('.alert-success').hide();
				$('.alert-danger').hide();
				$('.emailalert').show();
				$(window).scrollTop(0);
                console.log('failed', err);
                }
            });
		
        },
        updateNotification: function(id) {
            console.log("SCHEDULELAND.PROFILE updateNotification() invoking...");
            $.ajax({
                type: 'PUT',
                url: 'http://localhost:10880/user/' + id + '/edit/updateNotification',
                success: function(data) {
					 function redirect() {
                        window.location.href = "http://localhost:10880/user/"+id+"/edit";
                    }
                    setTimeout(redirect, 1000);
                    console.log('success', data);
                },
                error: function(err) {
					$('.alert-success').hide();
					$('.alert-danger').hide();
					$('.notificationalert').show();
					$(window).scrollTop(0);
                    console.log('failed', err);
                }
            });
		
        },


    };
    SCHEDULELAND.MEMBERSHIP = {
        init: function() {
            console.log("SCHEDULELAND.MEMBERSHIP init() invoking...");
            var me = this;

            $('.forget-btn').click(function(e) {
                var email = $('.email').val();
                var pattern = new RegExp("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");
                var isValid = pattern.test(email);
                if (email != '' && isValid) {
                    me.resetPasswordByEmail(email);
					
					 $('.emailsuccess').show();
                   

                }

            });

            $('.reset-btn').click(function(e) {
                e.preventDefault();
                me.resetPassword();

            });

        },

        resetPassword: function() {
            console.log("SCHEDULELAND.MEMBERSHIP resetPassword() invoking...");

            var newPwd = $('.newPwd').val();
            var token = window.location.pathname.split("/")[3];
            var rePwd = $('.rePwd').val();
            if (newPwd != rePwd) {
                $('.resetform input[type="password"]').val('');
                $(".resetspace").hide();
                $(".resetnotmatch").show();
            }
            if (newPwd == "" || rePwd == "") {
                $('.resetform input[type="password"]').val('');
                $(".resetnotmatch").hide();
                $(".resetspace").show();
            }
			
			else	{
            $.ajax({
                type: 'PUT',
                url: 'http://localhost:10880/resetPassword/' + token,
                data: {
                    newPwd: newPwd,
                    rePwd: rePwd
                },
                success: function(data) {
                    $('.resetform input[type="password"]').val('');
                    console.log('success', data);

                    $(".alert-danger").hide();
                    $(".alert-success").show();

                    function redirect() {
                        window.location.href = "http://localhost:10880/login";
                    }
                    setTimeout(redirect, 3000);

                },
                error: function(err) {
                    $(".alert-danger").show();
                    console.log('failed', err);
                }
            });
			}
        },

        resetPasswordByEmail: function(email) {
            console.log("SCHEDULELAND.MEMBERSHIP resetPasswordByEmail() invoking...");

            $.ajax({
                type: 'PUT',
                url: 'http://localhost:10880/resetPasswordByEmail',
                data: {
                    'email': email

                },
                success: function(user) {
                    console.log("success");

                    function redirect() {
                        window.location.href = "http://localhost:10880/login";
                    }
                    setTimeout(redirect, 1000000);
                    //$('.modal').modal('hide');

                    //TODO: redirect to the main page

                },
                error: function(err) {
                    console.log('failed', JSON.stringify(err));
                    //$('.modal').modal('hide');
                    //TODO: prompt an error message
                }
            });


        },
        /* wingkwong: PENDING
        init: function(){
        	console.log("SCHEDULELAND.MEMBERSHIP init() invoking...");
        	$(".create-btn").click(function(e){
        		var username = $(".register-name").val();
        		var password = $(".register-pass").val();
        		var conpass= $(".confirm-pass").val();
		
            	if(regpass!=conpass){
        	         alert("password should be same"); //TODO: advise wordings
        			 $(".register-pass").val("");
        			 $(".confirm-pass").val("");
        	     }else{
        	     	$.ajax({
        					type: 'POST',
        					url: '', //TODO: TBC
        					data: {
        						'username': username,
        						'passowrd': password
        					},
        					success: function (user) {
        						//TODO: redirect to the main page

        					},
        					error: function (err){
        						console.log ('failed', err);
        						//TODO: prompt an error message
        					}
        				});
        	     }	
        	});
        }
        */
    };

    SCHEDULELAND.SCHEDULE = {
        init: function() {
            console.log("SCHEDULELAND.SCHEDULE init() invoking...");
            var me = this;
            
			$.ajax({
				type: 'GET',
				url: 'http://localhost:10880/getSchedule',
				success: function(data) {
					console.log('success' + JSON.stringify(data));
					me.loadSchedule(data);
				},
				error: function(err){
					console.log('failed' + JSON.stringify(err));
					//TODO: error handling ...
				}
			});
        },
        loadSchedule: function(events) {
            console.log("SCHEDULELAND.SCHEDULE loadSchedule() invoking...");
           // console.log(JSON.stringify(events));
           // var events = JSON.stringify(events);
           console.log(events.mySchedule);

           /*re-conduct a event obj*/
		   var month = new Date();
		   var checkMonth = parseInt(month.getMonth()+1);
			var checkDate = parseInt((month.getMonth()+1)*100+month.getDate());
		   var temp = [];
		   var temp2 = [];
		   var sameday = [];
		   var sametime = [];
           var eventArr = [];
           var eventObj = JSON.parse(events.mySchedule);
           for(var i=0; i<eventObj.length; i++){
                var o = {};
                o.id = eventObj[i]._id;
                o.title = eventObj[i].local.title;
				o.location = eventObj[i].local.location;
				
				oyear = eventObj[i].local.date.substring(0,4);
				omonth = eventObj[i].local.date.substring(5,7);
				odate = eventObj[i].local.date.substring(8,10);
				ostartH = eventObj[i].local.startTime.substring(0,2);
				ostartS = eventObj[i].local.startTime.substring(3,5);
				oendH = eventObj[i].local.finishTime.substring(0,2);
				oendS = eventObj[i].local.finishTime.substring(3,5);
						
				o.start = new Date(oyear,parseInt(omonth)-1,odate,ostartH,ostartS,0,0).toISOString();;
				o.end = new Date(oyear,parseInt(omonth)-1,odate,oendH,oendS,0,0).toISOString();;
				
				console.log("o.start"+o.start);
				console.log("o.end"+o.end);
				
                o.description = eventObj[i].local.description;
                eventArr.push(o);
				
           }
		   console.log("all:"+JSON.stringify(eventArr));
		    for(var i=0; i<eventArr.length; i++){
				temp=eventArr[i].start.substring(0,10);
				for(var j=0; j<eventArr.length&& i!=j;j++){
					
				temp2 =	eventArr[j].start.substring(0,10);
				console.log("temp:"+temp);
				console.log("temp2:"+temp2);
				//console.log("check1:"+checkDate);
				//console.log("check2:"+parseInt(temp.substring(5,7)+temp.substring(8)));*/
				if(temp==temp2&& checkMonth==parseInt(temp.substring(5,7))){
					
					sameday.push(temp.substring(5).replace(/-/g,"/"));
					if(checkDate>parseInt(temp.substring(5,7)+temp.substring(8))){
					sameday.splice(temp.substring(5),1);
				}
					//console.log(checkDate>parseInt(temp.substring(5,7)+temp.substring(8)));
				}
			
				}
				
				
				console.log("same:"+sameday);
			}
			if(sameday.length>0){
			$('.sameDayAlert').show();
				$('.sameDayAlert').append("In this month, you have more than one activity on "+sameday+". please be punctual.")
			}	
           console.log(JSON.stringify(eventArr));
            var date = new Date(),
                d = date.getDate(),
                m = date.getMonth(),
                y = date.getFullYear(),
                started,
                categoryClass;

            var calendar = $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
				displayEventTime: false,
                selectable: true,
                selectHelper: true,
                eventRender: function(event, element)
                { 
					//element.find('.fc-title').empty();
					 
                    element.find('.fc-title').append("<br/>" + "<div class='fc-description'>" + event.location +"<br/>" +event.start.toString().substring(16,22)+"-"+event.end.toString().substring(16,21) +"<br/>"+"</div>"); 
                },
                select: function(start, end, allDay) {
                    $('#fc_create').click();

                    started = start;
                    ended = end;
                    console.log(started);
                    /*
                    $(".antosubmit").on("click", function() {
                        var title = $("#title").val();
                        if (end) {
                            ended = end;
                        }

                        categoryClass = $("#event_type").val();

                        if (title) {
                            calendar.fullCalendar('renderEvent', {
                                    title: title,
                                    start: started,
                                    end: ended,
                                    allDay: allDay
                                },
                                true // make the event "stick"
                            );
                        }

                        $('#title').val('');

                        calendar.fullCalendar('unselect');

                        $('.antoclose').click();

                        return false;
                    });
                    */
                },
                eventClick: function(calEvent, jsEvent, view) {
                	console.log("eventClick...");
                	console.log(calEvent);

                    $('#fc_edit').click();
                    $('#title2').val(calEvent.title);

                    location.href = "http://localhost:10880/activities/details/" + calEvent.id;


                    /*
                    categoryClass = $("#event_type").val();

                    $(".antosubmit2").on("click", function() {
                        calEvent.title = $("#title2").val();

                        calendar.fullCalendar('updateEvent', calEvent);
                        $('.antoclose2').click();
                    });

                    calendar.fullCalendar('unselect');
                    */
                },
                editable: false,
                //events: 'tmp/activities.json'
                events: eventArr
            });
        }
    };
    /*
    $(document).ready(function(){

      var thumb = $('img#thumb');        

      new AjaxUpload('imageUpload', {
        action: $('form#newHotnessForm').attr('action'),
        name: 'image',
        onSubmit: function(file, extension) {
          $('div.preview').addClass('loading');
        },
        onComplete: function(file, response) {
          thumb.load(function(){
            $('div.preview').removeClass('loading');
            thumb.unbind();
          });
          thumb.attr('src', response);
        }
      });
      
    });
    */
    SCHEDULELAND.SEARCH = {
        init: function() {
            console.log("SCHEDULELAND.SEARCH init() invoking...");
            

            $(".btn-search").click(function(e) {
                var keyword = $(".inputKeyword").val();
                 				
				 
                window.location.href = "http://localhost:10880/search/"+ keyword;

            });
			
	         $(".btn-asearch").click(function(e) {
                var keyword = $(".inputKeyword").val();
                var number =$("#select2").val();
                var tag =$("#tagPicker").val();
                var dstart=$(".dstart").val();
				var dend=$(".dend").val();
				var tFrom=$(".tFrom").val();
				var tTo=$(".tTo").val();
				var sorts = 0;
				
                if(tFrom.substring(tFrom.indexOf(" ")+1)=="AM"){  
				var tFrom1 = tFrom.substring(0,tFrom.indexOf(" "));
				if(tFrom1.length==4){
					tFrom1 = "0" + tFrom1;
				}
                }
				else{
				var tFrom2 = tFrom.substring(0,tFrom.indexOf(" "));
				var tFrom3 = (+tFrom2.substring(0,tFrom.indexOf(":")))+12;
				var tFrom1 = tFrom3 + tFrom2.substring(tFrom.indexOf(":"));
				}
				
                if(tTo.substring(tTo.indexOf(" ")+1)=="AM"){  
				var tTo1 = tTo.substring(0,tTo.indexOf(" "));
					if(tTo1.length==4){
					tTo1 = "0" + tTo1;
				}
                }
				else{
				var tTo2 = tTo.substring(0,tTo.indexOf(" "));
				var tTo3 = (+tTo2.substring(0,tTo.indexOf(":")))+12;
				var tTo1 = tTo3 + tTo2.substring(tTo.indexOf(":"));
				}
				
				if(tFrom1.length<4){
					tFrom1="";
				}
				
				if(tTo1.length<4){
					tTo1="";
				}
				
				window.location.href = "http://localhost:10880/search/"+ keyword+"?number="+number+"&dstart="+dstart+"&dend="+dend+"&tFrom="+tFrom1+"&tTo="+tTo1;
		
		       

            });
			
			     $(".btn-sort").click(function(e) {
				 
                 var str = window.location.href;
				 var sorts = "sorts";
				 var value = $(this).val();
		
		        function updateQueryStringParameter(uri, key, value) {
				  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
                  var separator = str.indexOf('?') !== -1 ? "&" : "?";
                  if (str.match(re)) {
                  return str.replace(re, '$1' + key + "=" + value + '$2');
                  }
                  else {
                  return str + separator + key + "=" + value;
                   }
				   }
                  
                window.location.href = updateQueryStringParameter(str,sorts,value) ;

            });
			
			
			$(".btn-type").click(function(e) {
				 
                 var str = window.location.href;
				 var type = "type";
				 var value = $(this).val();
		
		        function updateQueryStringParameter(uri, key, value) {
				  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
                  var separator = str.indexOf('?') !== -1 ? "&" : "?";
                  if (str.match(re)) {
                  return str.replace(re, '$1' + key + "=" + value + '$2');
                  }
                  else {
                  return str + separator + key + "=" + value;
                   }
				   }
                  
                window.location.href = updateQueryStringParameter(str,type,value) ;

            });
			
			$(".btn-paging").click(function(e) {
				 
                 var str = window.location.href;
				 var page = "page";
				 var value = $(this).val();
		
		        function updateQueryStringParameter(uri, key, value) {
				  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
                  var separator = str.indexOf('?') !== -1 ? "&" : "?";
                  if (str.match(re)) {
                  return str.replace(re, '$1' + key + "=" + value + '$2');
                  }
                  else {
                  return str + separator + key + "=" + value;
                   }
				   }
                  
                window.location.href = updateQueryStringParameter(str,page,value) ;

            });			
			
        },

    }


    SCHEDULELAND.DETAIL = {
        init: function() {
            console.log("SCHEDULELAND.DETAIL init() invoking...");
			
            $(".comment-btn").click(function(e) {
                e.preventDefault();
                var comment = $(".inputComment").val();
                var id = window.location.pathname.split("/")[3];
				console.log("SCHEDULELAND.DETAIL init() invoking..."+id);


                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:10880/commentForm/' + id,
                        data: {
                            'comment': comment,
                        },
                        success: function(data) {
                            console.log('success', data);
                            $(".alert-danger").hide();
                            $(".alert-info").show();

                            function redirect() {
                                window.location.href = "http://localhost:10880/activities/details/"+ id;
                            }
                            setTimeout(redirect, 3000);
                        },
                        error: function(err) {
                            console.log('failed', err);
                            $(".alert-danger").show();
                        }
                    });
               
            });
		}
	};
			
			
    SCHEDULELAND.ACTIVITIES = {
        init: function() {
            console.log("SCHEDULELAND.ACTIVITIES init() invoking...");
            var me = this;

            //Image preview function & getting the filename and file data for ajax post
            var file;
            var reader;
            var filename;
            var data;

            $('.inputFile').change(function(event) {
                var preview = $('.imgSrc');
                file = $('.inputFile')[0].files[0];
                reader = new FileReader();
                reader.onload = function(event) {
                    preview.attr("src", reader.result);
                    $(".imgSrc").show();
                    filename = file.name;
                    data = event.target.result;
                };
                reader.readAsDataURL(file);
            });

            //Submit button clicked action
            $(".create-activity-btn").click(function(e) {
                e.preventDefault();
                var title = $(".inputTitle").val();
                var organizer = $(".inputOrganizer").val();
                var date = $(".inputDate").val();
                var startTime = "";
                if ( $(".inputStartTime").val() != ""){
                     startTime = new Date(date + " " + $(".inputStartTime").val()).toISOString();
                }
                var finishTime = "";
                if ( $(".inputFinishTime").val() != ""){
                    finishTime = new Date(date + " " + $(".inputFinishTime").val()).toISOString();
                }
                var location = $(".inputLocation").val();
                var description = $(".inputDescription").val();
                var code = $(".inputCode").val();
				var number = $(".inputNumber").val();
                var createdAt = new Date().getTime();
                var lastModifiedAt = createdAt;

                console.log("startTime=" + startTime);
                console.log("finishTime=" + finishTime);

                if (me.inputValidation()){
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:10880/createActivityForm',
                        data: {
                            'title': title,
                            'organizer': organizer,
                            'date': date,
                            'startTime': startTime,
                            'finishTime': finishTime,
                            'location': location,
                            'description': description,
                            'code': code,
							'number':number,
                            'filename': filename,
                            'data': data,
                            'createdAt': createdAt,
                            'lastModifiedAt': lastModifiedAt,
                        },
                        success: function(data) {
                            console.log('success', data);
                            $(".alert-danger").hide();
                            $(".alert-success").show();

                            function redirect() {
                                window.location.href = "http://localhost:10880/activities";
                            }
                            setTimeout(redirect, 3000);
                        },
                        error: function(err) {
                            console.log('failed', err);
                            $(".alert-danger").show();
                        }
                    });

                }
            });
				$('.sd-invite-btn').click(function(e) {
					console.log("test");
					e.preventDefault();
				var id = $(this).data("href");
				var uid = $(this).data("id");
				console.log(id);
                me.inviteFriend(id,uid);
				$('.modal').modal('hide');
			});
            $('.join-activity-btn').click(function(e){
            	e.preventDefault();
            	var id = $(this).data("id");
            	me.joinActivity(id);
            });

//jay: for Nick
            $('.add-to-fav-btn').click(function(e){
            	e.preventDefault();
            	var id = $(this).data("id");
            	me.addToFav(id);
                $('.add-to-fav-btn').html("Added");
                $('.add-to-fav-btn').removeClass('add-to-fav-btn').addClass('added-btn');
            });

            $('.added-btn').click(function(e){
                e.preventDefault();
                var id = $(this).data("id");
                me.removeFromFav(id);
                $('.added-btn').html("Add to Favourites");
                $('.added-btn').removeClass('added-btn').addClass('add-to-fav-btn');
            });

            //Update activity button clicked
            $('.update-activity-btn').click(function(e){
                e.preventDefault();
                var id = window.location.pathname.split("/")[3];
                var title = $(".inputTitle").val();
                var organizer = $(".inputOrganizer").val();
                var date = $(".inputDate").val();
                var startTime = "";
                if ( $(".inputStartTime").val() != ""){
                     startTime = new Date(date + " " + $(".inputStartTime").val()).toISOString();
                }
                var finishTime = "";
                if ( $(".inputFinishTime").val() != ""){
                    finishTime = new Date(date + " " + $(".inputFinishTime").val()).toISOString();
                }
                var location = $(".inputLocation").val();
                var description = $(".inputDescription").val();
                var code = $(".inputCode").val();
                var number = $(".inputNumber").val();
                var createdAt = new Date().getTime();
                var lastModifiedAt = createdAt;

                console.log("startTime=" + startTime);
                console.log("finishTime=" + finishTime);

                if (me.inputValidation()){
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:10880/updateActivity/' + id,
                        data: {
                            'title': title,
                            'organizer': organizer,
                            'date': date,
                            'startTime': startTime,
                            'finishTime': finishTime,
                            'location': location,
                            'description': description,
                            'code': code,
                            'number':number,
                            'filename': filename,
                            'data': data,
                            'createdAt': createdAt,
                            'lastModifiedAt': lastModifiedAt,
                        },
                        success: function(data) {
                            console.log('success', data);
                            $(".alert-danger").hide();
                            $(".alert-success").show();

                            function redirect() {
                                window.location.href = "http://localhost:10880/activities";
                            }
                            setTimeout(redirect, 3000);
                        },
                        error: function(err) {
                            console.log('failed', err);
                            $(".alert-danger").show();
                        }
                    });

                }


            })
        },

        //Auto generating private code
        codeGen: function() {
            console.log("SCHEDULELAND.CREATE codeGen() invoking...");
            $(".option2").click(function() {
                var keylist = "abcdefghijklmnopqrstuvwxyz123456789"
                var temp = ''

                for (i = 0; i < 4; i++) {
                    temp += keylist.charAt(Math.floor(Math.random() * keylist.length))
                }

                $(".inputCode").val(temp)
                $(".inputCode").show();
            });

            $(".option1").click(function() {
                $(".inputCode").val('')
                $(".inputCode").hide();
            });

        },
			inviteFriend:function(id,uid) {
			console.log("SCHEDULELAND.PROFILE inviteFriend() invoking...");
			var invite= $('input:checkbox[name=friend]:checked').val();
			var checkboxArray = [];
			$(":checkbox").each(function () {
			var ischecked = $(this).is(":checked");
			if (ischecked) {
            checkboxArray.push(""+$(this).val());
        }
		}); 
		console.log(checkboxArray);
			    $.ajax({
					
                type: 'POST',
				url:'http://localhost:10880/inviteFriend/' + id,
				data:{
					invite:invite,
					checkboxArray:checkboxArray,
					uid:uid,
					id:id,
				},
                success: function(data) {
				

                    console.log('success', data);
					$('.modal').modal('hide');
                    //TODO: alert the response
                },
                error: function(err) {
                    console.log('failed', err);
                }
            });
		},
        joinActivity: function(id){
        	console.log('id=' + id);

            $.ajax({
                type: 'POST',
                url: 'http://localhost:10880/joinActivity/' + id,
                data: {
                    id: id
                },
                success: function(data) {
                    console.log('success', data);
                    $(".alert-danger").hide();
                    $(".alert-success").show();

                    function redirect() {
                        window.location.href = "http://localhost:10880/schedule";
                    }
                    setTimeout(redirect, 3000);

                },
                error: function(err) {
                    console.log('failed', JSON.stringify(err));
                    $(".alert-danger").show();
                }
            });

        },
        addToFav: function(id){
        	//code
            console.log('id=' + id);

            $.ajax({
                type: 'POST',
                url: 'http://localhost:10880/addToFav/' + id,
                data: {
                    id: id
                },
                success: function(data){
                    console.log('success', data);
                    $(".alert-danger").hide();
                    $(".alert-success").html("Activities added, you can check your favourite activities in profile page.")
                    $(".alert-success").show();

                    function redirect() {
                        window.location.href = "http://localhost:10880/activities/details/" + id;
                    }
                    setTimeout(redirect, 1500);
                },
                error: function(err) {
                    console.log('failed', JSON.stringify(err));
                    $(".alert-danger").show();
                }
            });
        },

        removeFromFav: function(id){
            console.log('id=' + id);

            $.ajax({
                type: 'POST',
                url: 'http://localhost:10880/removeFromFav/' + id,
                data: {
                    id: id
                },
                success: function(data){
                    console.log('success', data);
                    $(".alert-danger").hide();
                    $(".alert-success").html("Favourite Activitiy removed, you can check your favourite activities in profile page.")
                    $(".alert-success").show();

                    function redirect() {
                        window.location.href = "http://localhost:10880/activities/details/" + id;
                    }
                    setTimeout(redirect, 1500);
                },
                error: function(err) {
                    console.log('failed', JSON.stringify(err));
                    $(".alert-danger").show();
                }
            });

        },

        preloadEditData: function(){

            var title = $(".inputTitle").attr("data-value");
            var organizer = $(".inputOrganizer").attr("data-value");
            //date
            var date = $(".inputDate").attr("data-value");
            date = new Date(date);
            var yyyyMMdd = date.getFullYear()+'-'+(date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1)+'-'+ (date.getDate()+1<10?'0'+(date.getDate()+1):date.getDate()+1);
            //time
            var startTime = $(".inputStartTime").attr("data-value");
            var finishTime = $(".inputFinishTime").attr("data-value");

            var location = $(".inputLocation").attr("data-value");
            var description = $(".inputDescription").attr("data-value");
            var code = $(".inputCodeText").attr("data-value");
            var number = $(".inputNumberText").attr("data-value");
            var createdAt = new Date().getTime();
            var lastModifiedAt = createdAt;
            // console.log(title);
            // console.log(organizer);
            // console.log(date);
            // console.log(location);
            // console.log(description);
            // console.log(radio);
            // console.log(code);
            console.log("startTime=" + startTime);
            console.log("finishTime=" + finishTime);

            //console.log("yyyyMMdd" + yyyyMMdd);
            $(".inputTitle").val(title);
            $(".inputOrganizer").val(organizer);
            $('.inputDate').val(yyyyMMdd);
            $(".inputStartTime").val(startTime);
            $(".inputFinishTime").val(finishTime);
            $(".inputLocation").val(location);
            $(".inputDescription").val(description);
            $(".inputCode").val(code);
            $(".inputNumber").val(number);
            
        },

                inputValidation: function(){
                    var todayDate = new Date();
                    var td = todayDate.getDate();
                    var tm = todayDate.getMonth()+1;
                    var ty = todayDate.getFullYear();

                    var eventDate = $(".inputDate").val();
                    eventDate = new Date(eventDate);
                    var ed = eventDate.getDate();
                    var em = eventDate.getMonth()+1;
                    var ey = eventDate.getFullYear();

                    if ($(".inputTitle").val() == "") {
                        $(".alert-danger").html('Please fill in a complete title');
                        $(".alert-danger").show();
                        return false;
                    }else if ($(".inputOrganizer").val() == ""){
                        $(".alert-danger").html('Please fill in the organizer');
                        $(".alert-danger").show();
                        return false;
                    }else if ($(".inputDate").val() == ""){
                        $(".alert-danger").html('Please select a date');
                        $(".alert-danger").show();
                        return false;
                    }
                    //comparison on date
                    else if (ey < ty || ((ey == ty)&&(em < tm)) || ((ey == ty)&&(em == tm)&&(ed < td))){
                        $(".alert-danger").html('Please select a date in the future');
                        $(".alert-danger").show();
                        return false;
                    }else if ($(".inputStartTime").val() == ""){
                        $(".alert-danger").html('Please fill in the starting time');
                        $(".alert-danger").show();
                        return false;
                    }else if ($(".inputFinishTime").val() == ""){
                        $(".alert-danger").html('Please fill in the finish time');
                        $(".alert-danger").show();
                        return false;
                    }
                    //comparison on starting time & finishing time
                    else if ($(".inputStartTime").val() >= $(".inputFinishTime").val()){
                        $(".alert-danger").html('Finishing time cannot be before starting time');
                        $(".alert-danger").show();
                    }else if ($(".inputLocation").val() == ""){
                        $(".alert-danger").html('Please fill in the location');
                        $(".alert-danger").show();
                        return false;
                    }else if ($(".inputDescription").val() == ""){
                        $(".alert-danger").html('Please fill add some descriptions');
                        $(".alert-danger").show();
                        return false;
                    }else if ($(".inputCode").val() == null){
                        $(".alert-danger").html('Please select an activity type from the list');
                        $(".alert-danger").show();
                    }else if ($(".inputNumber").val() == null){
                        $(".alert-danger").html('Please select an expected number of participants from the list');
                        $(".alert-danger").show();
                    }else{
                        return true;
                    }
                }

    };


    if ($('.register-page').length > 0) {
        SCHEDULELAND.MEMBERSHIP.init();
    }
    if ($('.login-page').length > 0) {
        SCHEDULELAND.MEMBERSHIP.init();
    }

    if ($('.reset-page').length > 0) {
        SCHEDULELAND.MEMBERSHIP.init();
    }

    if ($('.schedule-page').length > 0) {
        SCHEDULELAND.SCHEDULE.init();
    }

    if ($('.activities-page').length > 0) {
        SCHEDULELAND.SEARCH.init();
        SCHEDULELAND.ACTIVITIES.init();
        SCHEDULELAND.ACTIVITIES.codeGen();
        SCHEDULELAND.ACTIVITIES.preloadEditData();
    }

    if ($('.detail-page').length > 0) {
        SCHEDULELAND.DETAIL.init();
    }

    if ($('.profile-page').length > 0) {
        SCHEDULELAND.PROFILE.init();
    }

    if ($('.edit-page').length > 0) {
        SCHEDULELAND.PROFILE.init();
        SCHEDULELAND.UTILS.photoPreview();
    }



});