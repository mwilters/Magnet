using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Magnet.Models;
using Magnet.ViewModels;

namespace Magnet.Controllers
{
    public class DashboardController : Controller
    {
        //Getting data from database
        private ApplicationDbContext _context;

        public DashboardController()
        {
            _context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
        }

        // GET: Dashboard
        public ActionResult Index()
        {
            var locations = _context.Locations.ToList();

            foreach (Location l in locations)
            {
                l.WaitTime = _context.WaitTimes.SingleOrDefault(wt => wt.LocationID == l.ID);
            }

            return View(locations);

        }
    }
}