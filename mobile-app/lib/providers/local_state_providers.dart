import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import '../utils/storage_helper.dart';

final localFileListProvider = NotifierProvider<LocalFileList, List<PlatformFile>>(LocalFileList.new);
class LocalFileList extends Notifier<List<PlatformFile>> {
  @override
  List<PlatformFile> build() {
    _loadFromStorage();
    return [];
  }

  Future<void> _loadFromStorage() async {
    final queueMaps = await StorageHelper.loadQueue();
    if (queueMaps.isNotEmpty) {
      state = queueMaps.map((map) => PlatformFile(
        name: map['name'] as String,
        size: map['size'] as int,
        path: map['path'] as String?,
      )).toList();
    }
  }

  void _saveToStorage(List<PlatformFile> files) {
    final maps = files.map((f) => {
      'name': f.name,
      'size': f.size,
      'path': f.path,
    }).toList();
    StorageHelper.saveQueue(maps);
  }

  void add(PlatformFile file) {
    state = [...state, file];
    _saveToStorage(state);
  }

  void remove(PlatformFile file) {
    state = state.where((f) => f != file).toList();
    _saveToStorage(state);
  }

  void clear() {
    state = [];
    _saveToStorage(state);
  }
}

// Badge counters for unseen items
final unseenUploadsProvider = NotifierProvider<UnseenCounter, int>(UnseenCounter.new);
final unseenDraftsProvider = NotifierProvider<UnseenCounter, int>(UnseenCounter.new);
class UnseenCounter extends Notifier<int> {
  @override
  int build() => 0;
  void increment() => state = state + 1;
  void reset() => state = 0;
}

final selectedFileProvider = NotifierProvider<SelectedFile, PlatformFile?>(SelectedFile.new);
class SelectedFile extends Notifier<PlatformFile?> {
  @override
  PlatformFile? build() => null;
  void select(PlatformFile? file) => state = file;
  void clear() => state = null;
}
