const { JWTInvalidError } = require('../classes/JWTInvalidError');
const { QueryError } = require('../classes/QueryError');
const { createNewKegiatanFeature } = require('../feature/createNewKegiatanFeature');
const { refIdValidator } = require('../util/validator');
const { getUserPermissionLevel } = require('../util/getUserPermissionLevel');
const { getMinimumFeaturePermission } = require('../util/getMinimumFeaturePermission');
const { viewAllKegiatan } = require('../feature/viewAllKegiatan');
const { initSocmedPostValidatorFeature } = require('../feature/socmedPostValidatorFeature');
const { generateErrorEmail } = require('../util/email');
const { CustomError } = require('../classes/CustomError');

const {
  getFormShapeDataFeature,
  postDynamicFormFeature
} = require('../feature/dynamicFormFeature');

const validateFeatureId = (featureId) => refIdValidator(featureId);

const postFeaturePermissionHandler = async (req, res) => {
  const isFeatureIdValid = validateFeatureId(req.params.featureId);

  if (!isFeatureIdValid) {
    res.status(404).json({ errorMessage: 'Feature not found or invalid feature id used.' });
    return;
  }

  const { featureId } = req.params;

  try {
    
    const minimumFeaturePermission = await getMinimumFeaturePermission(featureId);
    const userPermissionLevel = await getUserPermissionLevel(req.email);

    if (userPermissionLevel < minimumFeaturePermission) {
      await generateErrorEmail(`${req.email} trying to access ${req.originalUrl}`);
      res.status(403).json({ errorMessage: 'FORBIDDEN. You do not have required permission to use this feature.' });
      return;
    }
    
    switch (featureId) {
      case 'feature001': // create new kegiatan
        createNewKegiatanFeature(req, res);
        break;

      case 'feature002': // view all kegiatan
        viewAllKegiatan(req, res);
        break;

      case 'feature003': // create social media post validation using ocr
        initSocmedPostValidatorFeature(req, res);
        break;
      
      case 'feature006': //post dynamic form
        postDynamicFormFeature(req, res);
        break;

      default:
        res.status(404).render('errorPage', {
          errorMessage: 'Feature not found.',
        });
    }
  } catch (e) {
    if (e instanceof JWTInvalidError) {
      res.status(401).json({ errorMessage: 'FORBIDDEN. Please Login First.' });
    } else if (e instanceof QueryError) {
      res.status(500).json({ errorMessage: 'Server Error. Failed to perform requested query.' });
    } else {
      console.log(e);
    }
  }
};

module.exports = { featurePermissionHandler };
