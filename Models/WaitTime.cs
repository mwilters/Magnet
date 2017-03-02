using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Magnet.Models
{
    public class WaitTime
    {
        public Guid ID { get; set; }
        public Guid LocationID { get; set; }
        public int CurrentWaitTime { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}