import type { Request, Response } from 'express';

import { SpecialService } from '../services/special.service';

export class SpecialController {
  private specialService: SpecialService;

  constructor(specialService: SpecialService = new SpecialService()) {
    this.specialService = specialService;
  }
  async getAllSpecials(req: Request, res: Response): Promise<void> {
    try {
      const specials = await this.specialService.getAllSpecials();
      res.json(specials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch specials' });
    }
  }

  async getActiveSpecials(req: Request, res: Response): Promise<void> {
    try {
      const specials = await this.specialService.getActiveSpecials();
      res.json(specials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch active specials' });
    }
  }

  async getSpecialById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const special = await this.specialService.getSpecialById(id);

      if (!special) {
        res.status(404).json({ error: 'Special not found' });
        return;
      }

      res.json(special);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch special' });
    }
  }

  async createSpecial(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, price, isActive } = req.body;

      if (!title || price === undefined) {
        res.status(400).json({ error: 'Title and price are required' });
        return;
      }

      const special = await this.specialService.createSpecial({
        title,
        description,
        price: parseFloat(price),
        isActive,
      });
      res.status(201).json(special);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create special' });
    }
  }

  async updateSpecial(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, price, isActive } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (isActive !== undefined) updateData.isActive = isActive;

      const special = await this.specialService.updateSpecial(id, updateData);

      if (!special) {
        res.status(404).json({ error: 'Special not found' });
        return;
      }

      res.json(special);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update special' });
    }
  }

  async deleteSpecial(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const special = await this.specialService.deleteSpecial(id);

      if (!special) {
        res.status(404).json({ error: 'Special not found' });
        return;
      }

      res.json({ message: 'Special deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete special' });
    }
  }
}
