using System;
using System.Data.Entity;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Magnet.Models;

namespace Magnet.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationDbContext _context;

        public HomeController()
        {
            _context = new ApplicationDbContext();
        }

        public ActionResult Index()
        {
            return View();
        }

        //GetAllLocation - for fetch all the location from database and show in the view  
        //Shows all the locations in default map here.  
        public JsonResult GetAllLocation()
        {
            var locationList = _context.Locations.OrderBy(a => a.Name).ToList();
            var waitTimes = _context.WaitTimes.ToList();

            foreach(Location l in locationList)
            {
                foreach(WaitTime w in waitTimes)
                {
                    if(l.ID == w.LocationID)
                    {
                        l.WaitTime = w;
                    }
                }
            }
            
            return new JsonResult
            {
                Data = locationList,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
            
        }

        //GetAllLocation - for fetch all the location from database and show in the view  
        //Shows all the locations in default map here.  
        public JsonResult GetCities()
        {
            var cityList = _context.Locations.OrderBy(a => a.City).Distinct().ToList();
            var cities= cityList.GroupBy(
                i => i.City,
                (key, group) => group.First()
                ).ToList();

            return new JsonResult
            {
                Data = cities,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        //This method gets the markers info from database. Use the select statement to get
        //locations near users current location.  Need to pass in the users current location 
        public JsonResult GetNearByLocations(double currentLat, double currentLng, int searchRadius)
        {
            var locations = _context.Locations;
            var locationList = _context.Locations.SqlQuery("SELECT * FROM Locations WHERE ( 6371 * acos( cos( radians(" + currentLat + ") ) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - radians(" + currentLng + ") ) + sin( radians(" + currentLat + ") ) * sin( radians( Latitude ) ) ) ) < " + searchRadius + ";").ToList();

            var waitTimes = _context.WaitTimes.ToList();

            foreach (Location l in locationList)
            {
                foreach (WaitTime w in waitTimes)
                {
                    if (l.ID == w.LocationID)
                    {
                        l.WaitTime = w;
                    }
                }
            }

            //Sort List by CurrentWait Time
            var sortedLocationList = locationList.OrderBy(x => x.WaitTime.CurrentWaitTime).ToList();

            return new JsonResult
            {
                Data = sortedLocationList,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        
        //This method gets the markers info from database. Use the select statement to get
        //locations near users current location.  Need to pass in the users current location 
        public JsonResult GetSelectedLocation(string search)
        {
            var locations = _context.Locations;
            var locationList = _context.Locations.Where(a => a.Name == search).ToList();

            var waitTimes = _context.WaitTimes.ToList();

            foreach (Location l in locationList)
            {
                foreach (WaitTime w in waitTimes)
                {
                    if (l.ID == w.LocationID)
                    {
                        l.WaitTime = w;
                    }
                }
            }

            return new JsonResult
            {
                Data = locationList,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //This method gets the markers info from database. Use the select statement to get
        //locations of the city entered by the user. 
        public JsonResult GetLocationsByCity(string searchCity)
        {
            var locations = _context.Locations;
            var locationList = _context.Locations.Where(a => a.Name == searchCity).ToList();

            var waitTimes = _context.WaitTimes.ToList();

            foreach (Location l in locationList)
            {
                foreach (WaitTime w in waitTimes)
                {
                    if (l.ID == w.LocationID)
                    {
                        l.WaitTime = w;
                    }
                }
            }

            return new JsonResult
            {
                Data = locationList,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}