// !(function(){
	var defaults;
	// $('.resizable').resizable()
	$('.addfield').click(addfield)
	$('.projectName input').one('focus',clearValue)
	$('.fieldLabel input').one('focus',clearValue).change(showFieldType)
	$('.fieldType select')
		.change(addSelectOption)
		// .change(showSelectOptions)
		.addClass('noremove')
		.children()
			.addClass('noremove');
	$('.addAnother span').click(addSelectOption)
	$('.submit a').click(submit)
	
	function clearValue(e){
		if(e.target)
			e.target.value = ''
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
		var remover = $('<span>X</span>').click(function(e){$(this).parent().remove()})
			.addClass('remover')
		var clone = $('.selectOption.cloneme').clone(true)
			.removeClass('cloneme')
			.append(remover)
			.append(
				$('.addAnother').show()
			)
			.appendTo('.fieldInputs')
			.fadeIn()
			.children()
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
		$('.selectOption input:not(.empty)').each(function(){sos.push(this.value)})
		var so = $(document.createElement('textarea'))
			.attr('aria-type','fieldValueOptions')
			// .attr('type','text')
			.val(sos.join(', '))
			.appendTo(soDiv);
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
			})
			.appendTo(con);
		
		$('.fieldInputs .hideable, .addfield').hide()
			.find(':not(.noremove)').remove();
		$('.fieldLabel input').one('focus',clearValue)
			.change(showFieldType)[0].value = ''
		
		$('.fieldInputs select').val('');
			
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
			project: $('.projectName input').val(),
			fields: arr
		};
		
		return makeParams(json)
		// return json
	}
	function makeParams(d){
		var params = $.param(d)
		return params
	}
	
	function submit(){
		var qs = getFieldJSON();
		$.ajax({
			url: 'http://localhost:9005/datadict?' + qs,
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