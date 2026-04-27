import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();
  const jobs = await Job.find({ status: 'open' });

  const jobEntries = jobs.map((job) => ({
    url: `https://careers.forg.to/jobs/${job._id}`,
    lastModified: job.updatedAt || job.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://careers.forg.to',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...jobEntries,
  ];
}
