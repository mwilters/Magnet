using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Magnet.Models;

namespace Magnet.ViewModels
{
    public class DashboardViewModel
    {
        public List<Location> Locations { get; set; }
        public WaitTime WaitTime { get; set; }
    }
}