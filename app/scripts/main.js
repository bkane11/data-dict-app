// !(function(){
	// var defaults;
	var rest = 'http://poak-gis1.portoakland.internal';
	// $('.resizable').resizable()
	$('.addfield').click(addfield)
	$('.projectName input').one('focus',clearValue)
	$('.fieldLabel input').one('focus',clearValue).change(showFieldType)
	
	$('.fieldType select')
		.change(function(){
			if(['ss', 'ms'].indexOf($(this.selectedOptions).attr('data'))!=-1){
				$('.addAnother, .selectOption:not(.cloneme)').stop().fadeIn();
				$('.selectOption:not(.cloneme)').fadeIn()
					.find('input')
						.removeClass('noadd');
				if(!$('.selectOption:not(.cloneme)').length>0)
					addSelectOption(),
					$('.addfield').stop().fadeOut();
				else
					$('.addfield').stop().fadeIn();
					
			}else{
				$('.addAnother, .selectOption:not(.cloneme)').stop().fadeOut();
				$('.selectOption:not(.cloneme)').fadeOut()
					.find('input')
						.addClass('noadd');
				$('.addfield').stop().fadeIn();
			}
			
		})
		// .change(showSelectOptions)
		.addClass('noremove')
		.children()
			.addClass('noremove');
	
	$('.addAnother span').click(addSelectOption)
	$('.submit a').click(submit)
	$('input:not(input[type=date]), select').each(function(){
			$(this).attr('default', $(this).val());
		}).addClass('empty')
		.one('focus',clearValue);
	
	// set date field to now
	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	$('input[type=date]')
		.width($('.projectName input').width())
		.val(now.getFullYear()+"-"+(month)+"-"+(day) );
	
	function clearValue(e){
		if(e.target)
			e.target.value = '',
			$(e.target).removeClass('empty')
	}
	
	function showRequire(el, msg){
		console.log(el.value, msg);
	}
	
	function showFieldType(e){
		// showRequire(e.target, 'This is req');
		$('.fieldType').fadeIn();
	}
	function showSelectOptions(e){
		// showRequire(e.target, 'This is req');
		if($('.selectOption').length==1)
			addSelectOption()
	}
	function addSelectOption(e){
		var remover = $('<span>X</span>').click(function(e){
				$(this).parent().remove();
				if(!$('.selectOption:not(.cloneme)').length>0)
					addSelectOption(),
					$('.addfield').stop().fadeOut();
			})
			.addClass('remover')
		var clone = $('.selectOption.cloneme').clone(true)
			.removeClass('cloneme')
			.removeClass('noremove')
			.append(remover)
			.appendTo('.fieldInputs')
			.fadeIn()
			.children()
				.removeClass('noremove')
				.one('focus',clearValue)
				.one('change', function(){
					$(this).removeClass('empty');
					$('.addfield').show()
				});
	}
	
	function addfield(){
		var row = $(document.createElement('div'))
			.addClass('row field');
		var labelDiv = $(document.createElement('div'))
			.addClass('col-lg-3 resizable')
			.appendTo(row);
		var label = $('.fieldLabel input').clone()
			.attr('aria-type','fieldLabel')
			.appendTo(labelDiv);
		var typeDiv = $(document.createElement('div'))
			.addClass('col-lg-3 resizable')
			.appendTo(row);
		var type = $('.fieldType select').clone()
			.attr('aria-type','fieldType')
			.val($('.fieldType select').val())
			.appendTo(typeDiv);
		var soDiv = $(document.createElement('div'))
			.addClass('col-lg-3 resizable')
			.appendTo(row);
		var sos = [];
		$('.selectOption input:not(.empty):not(.noadd)').each(function(){sos.push(this.value)});
		if(sos.length>0){
			var so = $(document.createElement('textarea'))
				.attr('aria-type','fieldValueOptions')
				.val(sos.join(', '))
				.appendTo(soDiv);
		}
		row.appendTo('.fieldTable');
		var con = $(document.createElement('div'))
			.addClass('col-lg-1 tableButtons')
			.appendTo(row);
		var dup = $(document.createElement('div'))
			.addClass('row duplicator')
			.attr('title', 'Duplicate field')
			.html('++')
			.click(function(){
				var rp = $(this).parent().parent()
				rp.clone(true, true)
					.insertAfter(rp)
					.find('[aria-type]')
						.each(function(){
							$(this).val(rp.find('[aria-type='+$(this).attr('aria-type')+']').val());
							if($(this).attr('aria-type')=='fieldLabel')
								$(this).val($(this).val()+'_copy')
					});
			})
			.appendTo(con);
		var del = $(document.createElement('div'))
			.addClass('row copier')
			.attr('title', 'Delete field')
			.html('X')
			.click(function(){
				var rp = $(this).parent().parent()
				rp.remove();
				var f = $('.field');
				if (f.length==0){
					$('.tableHeaders, .submit').fadeOut();
					$('.fieldInputs input.noremove[required], .fieldInputs select.noremove[required]')
						.attr('required', 'required');
				}
			})
			.appendTo(con);
		
		$('.fieldInputs .hideable, .addfield').hide()
			.find(':not(.noremove)')
				.remove();
		$('.fieldLabel input').one('focus',clearValue)
			.change(showFieldType)[0].value = '';
			
		$('.fieldInputs input.noremove[required], .fieldInputs select.noremove[required]')
			.removeAttr('required');
			
		$('.fieldInputs select')
			.val('');
			
		if($('.fieldTable, .submit').css('display')=='none')
			$('.fieldTable, .submit').stop().fadeIn();
	}
	
	function getFieldJSON(){
		var arr = [];
		$('.field').each(function() {
			var o = {};
			$(this).find('[aria-type]')
				.each(function(){
					o[$(this).attr('aria-type')] = $(this).val();
			})
			arr.push(o)
		}).get();
		
		var json = {
			submitterName: $('[aria-type=submitterName]').val(),
			submitterEmail: $('[aria-type=submitterEmail]').val(),
			chargeNumber: $('[aria-type=chargeNumber]').val(),
			fieldworkDate: $('[aria-type=fieldworkDate]').val(),
			project: $('.projectName input').val(),
			fields: arr
		};
		
		return makeParams(json)
	}
	
	function makeParams(d){
		var params = $.param(d)
		return params
	}
	
	function ensure(){
		var pass = true
		$('[required]').map(function(){
			if ( $(this).val()=='' || typeof $(this).val() == 'undefined' || $(this).attr('default') == $(this).val() ){
				 pass = false;
				 console.log($(this).attr('default'), $(this).val());
				 $(this)
					.one('change', function(){ 
						$(this).parent().removeClass('required')
					})
					.parent().addClass('required')
			}
		})
		return pass
	}
	
	function submit(){
		if(!ensure())
			return
		
		var qs = getFieldJSON();
		$.ajax({
			url: rest + ':9005/datadict?' + qs,
			success: submitSuccess,
			error: submitError
		})
	}
	
	function submitSuccess(r){
		console.log(r);
	}
	function submitError(e){
		console.log(e);
	}
// })()