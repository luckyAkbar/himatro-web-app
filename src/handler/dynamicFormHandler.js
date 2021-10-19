const getDynamicFormHandler = (req, res) => {
  const { formId } = req.params;

  res.render('dynamicForm', {
    formId,
  });
};

module.exports = { getDynamicFormHandler, };
