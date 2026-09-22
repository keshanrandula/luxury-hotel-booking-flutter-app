import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/booking_entity.dart';

class WriteReviewSheet extends StatefulWidget {
  final BookingEntity booking;
  final VoidCallback? onReviewSubmitted;

  const WriteReviewSheet({
    super.key,
    required this.booking,
    this.onReviewSubmitted,
  });

  static Future<void> show(
    BuildContext context, {
    required BookingEntity booking,
    VoidCallback? onReviewSubmitted,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: WriteReviewSheet(
          booking: booking,
          onReviewSubmitted: onReviewSubmitted,
        ),
      ),
    );
  }

  @override
  State<WriteReviewSheet> createState() => _WriteReviewSheetState();
}

class _WriteReviewSheetState extends State<WriteReviewSheet> {
  double _selectedRating = 5.0;
  final TextEditingController _commentController = TextEditingController();
  final List<String> _attachedPhotos = [];
  bool _isSubmitting = false;

  final List<String> _samplePhotoPresets = [
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  ];

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  String get _ratingLabel {
    if (_selectedRating >= 5.0) return 'Exceptional • 5.0';
    if (_selectedRating >= 4.0) return 'Very Good • 4.0';
    if (_selectedRating >= 3.0) return 'Average • 3.0';
    if (_selectedRating >= 2.0) return 'Below Average • 2.0';
    return 'Poor Experience • 1.0';
  }

  void _addPhoto() {
    if (_attachedPhotos.length >= 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Maximum 4 photos per review.')),
      );
      return;
    }
    setState(() {
      final nextPreset = _samplePhotoPresets[_attachedPhotos.length % _samplePhotoPresets.length];
      _attachedPhotos.add(nextPreset);
    });
  }

  void _removePhoto(int index) {
    setState(() {
      _attachedPhotos.removeAt(index);
    });
  }

  Future<void> _submitReview() async {
    final comment = _commentController.text.trim();
    if (comment.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please write a brief comment about your stay.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    // Simulate review upload to API
    await Future.delayed(const Duration(milliseconds: 1000));

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    Navigator.pop(context);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: const [
            Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                'Thank you! Your verified review has been submitted for moderation.',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.success,
        duration: const Duration(seconds: 4),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );

    widget.onReviewSubmitted?.call();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.surfaceDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 30,
            offset: const Offset(0, -10),
          ),
        ],
      ),
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 44,
                height: 4,
                margin: const EdgeInsets.only(bottom: 18),
                decoration: BoxDecoration(
                  color: isDark ? Colors.white24 : Colors.black12,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),

            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Rate Your Experience',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.4,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.booking.hotelName,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.accentGold,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close_rounded),
                  color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Star Rating Section
            Center(
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (index) {
                      final starVal = index + 1.0;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedRating = starVal),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: Icon(
                            starVal <= _selectedRating ? Icons.star_rounded : Icons.star_outline_rounded,
                            size: 40,
                            color: starVal <= _selectedRating ? AppColors.starRating : AppColors.textMutedLight,
                          ),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.accentGold.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _ratingLabel,
                      style: const TextStyle(
                        color: AppColors.accentGold,
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Review Commentary TextField
            Text(
              'Your Detailed Feedback',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _commentController,
              maxLines: 4,
              maxLength: 500,
              style: TextStyle(
                fontSize: 13.5,
                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
              ),
              decoration: InputDecoration(
                hintText: 'Describe room comfort, concierge service, views, fine dining, or overall atmosphere...',
                hintStyle: TextStyle(
                  fontSize: 12.5,
                  color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                ),
                filled: true,
                fillColor: isDark ? AppColors.cardDark : AppColors.cardLight,
                contentPadding: const EdgeInsets.all(16),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(
                    color: isDark ? AppColors.borderDark : AppColors.borderLight,
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.accentGold, width: 1.5),
                ),
              ),
            ),

            const SizedBox(height: 14),

            // Photos Attachment
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Add Stay Photos (${_attachedPhotos.length}/4)',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                  ),
                ),
                if (_attachedPhotos.length < 4)
                  TextButton.icon(
                    onPressed: _addPhoto,
                    icon: const Icon(Icons.add_a_photo_outlined, size: 16, color: AppColors.accentGold),
                    label: const Text(
                      'Attach Photo',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.accentGold,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),

            if (_attachedPhotos.isNotEmpty)
              SizedBox(
                height: 72,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _attachedPhotos.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 10),
                  itemBuilder: (context, idx) {
                    return Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.network(
                            _attachedPhotos[idx],
                            width: 72,
                            height: 72,
                            fit: BoxFit.cover,
                          ),
                        ),
                        Positioned(
                          top: 2,
                          right: 2,
                          child: GestureDetector(
                            onTap: () => _removePhoto(idx),
                            child: Container(
                              padding: const EdgeInsets.all(3),
                              decoration: const BoxDecoration(
                                color: Colors.black87,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.close, size: 12, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),

            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitReview,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentGold,
                  foregroundColor: AppColors.primaryNavy,
                  elevation: 4,
                  shadowColor: AppColors.accentGold.withOpacity(0.4),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: _isSubmitting
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: AppColors.primaryNavy,
                      ),
                    )
                  : const Text(
                      'Publish Verified Review',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.2,
                      ),
                    ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
