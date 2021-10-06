const { getMinimumFeaturePermission } = require('../util/getMinimumFeaturePermission');
const { getUpcomingEvents } = require('../util/getUpcomingEvents');
const { getUserPermissionLevel } = require('../util/getUserPermissionLevel');

const getAdminPage = async (req, res) => {
  try {
    const userPermissionLevel = await getUserPermissionLevel(req.email);
    const featurePermissonLevel = await getMinimumFeaturePermission('feature005');

    if (userPermissionLevel < featurePermissonLevel) {
      console.log(`${req.email} trying to access ${req.originalUrl}`);
      res.status(403).render('errorPage', {
        errorMessage: 'FORBIDDEN. You are not allowed to see this page.',
      });
      return;
    }
    
    const upcomingEvents = await getUpcomingEvents();

    res.status(200).render('adminPage', {
      upcomingEvents,
    });
  } catch (e) {
    res.status(500).render('errorPage', {
      errorMessage: 'Internal Server Error. Please contact admin to resolve',
    });
  }
};

module.exports = { getAdminPage };
