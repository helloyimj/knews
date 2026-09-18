/**
 * cms_file.js
 * CMS 콘텐츠 첨부 다운로드 (cfd.do)
 * 페이지 인라인 function cfd / #contFileDown 을 공통으로 분리
 */
function ensureContFileDownForm() {
  if (document.getElementById('contFileDown')) return;
  var form = document.createElement('form');
  form.id = 'contFileDown';
  form.name = 'contFileDown';
  form.method = 'POST';
  form.innerHTML = '<input type="hidden" name="FILE_NM"><input type="hidden" name="FILE_ORG_NM">';
  document.body.appendChild(form);
}

function cfd(file, ofile) {
  ensureContFileDownForm();
  var $form = $('#contFileDown');
  $form.find('input:hidden[name=FILE_NM]').val(file);
  $form.find('input:hidden[name=FILE_ORG_NM]').val(ofile);

  var doc = document.contFileDown;
  if (!doc) return;
  doc.target = '_self';
  doc.action = '/ajaxa/fileCpnt/cfd.do';
  doc.submit();
}

$(function () {
  ensureContFileDownForm();
});
